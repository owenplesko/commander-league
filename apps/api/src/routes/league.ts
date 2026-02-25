import { inviteCode, league, leaguePlayer } from "../db/schema";
import { and, count, eq, ne } from "drizzle-orm";
import type {
  GetLeagueMemberInput,
  League,
  LeagueMember,
} from "@commander-league/contract/schemas";
import { MAX_INVITE_COUNT } from "@commander-league/contract/constants";
import { ORPCError } from "@orpc/server";
import { generateBase36Code } from "../lib/generateInviteCode";
import { pub } from "../orpc";
import {
  leagueMemberGuard,
  leagueOwnerGuard,
} from "../middleware/leagueMembership";
import { authGuard } from "../middleware/auth";

// TODO: add a search param for userId instead of getting from auth
const listLeague = pub.league.list
  .use(authGuard)
  .handler(async ({ context }) => {
    const leagues: League[] = await context.env.db
      .select({ id: league.id, name: league.name })
      .from(league)
      .innerJoin(leaguePlayer, eq(league.id, leaguePlayer.leagueId))
      .where(eq(leaguePlayer.playerId, context.userId));
    return leagues;
  });

const getLeague = pub.league.get
  .use(leagueMemberGuard)
  .handler(({ input, context }) => {
    const res: League | undefined = context.env.db
      .select({ id: league.id, name: league.name })
      .from(league)
      .where(eq(league.id, input.leagueId))
      .get();

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const createLeague = pub.league.create
  .use(authGuard)
  .handler(async ({ input, context }) => {
    const newLeague = await context.env.db.transaction(async (tx) => {
      const newLeague = tx.insert(league).values(input).returning().get();
      await tx.insert(leaguePlayer).values({
        leagueId: newLeague.id,
        playerId: context.userId,
        role: "owner",
      });
      return newLeague;
    });
    return newLeague;
  });

const joinLeague = pub.league.join
  .use(authGuard)
  .handler(async ({ input, context }) => {
    const leagueRes = await context.env.db.transaction(async (tx) => {
      const leagueRes = tx
        .select()
        .from(league)
        .innerJoin(inviteCode, eq(league.id, inviteCode.leagueId))
        .where(
          and(
            eq(inviteCode.code, input.inviteCode),
            eq(inviteCode.active, true),
          ),
        )
        .get();

      if (!leagueRes) throw new ORPCError("NOT_FOUND");

      await tx.insert(leaguePlayer).values({
        leagueId: leagueRes.league.id,
        playerId: context.userId,
        role: "player",
      });

      await tx
        .update(inviteCode)
        .set({ uses: leagueRes.invite_code.uses + 1 })
        .where(eq(inviteCode.code, input.inviteCode));

      return leagueRes.league;
    });

    return leagueRes;
  });

const updateLeague = pub.league.update
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    const { leagueId, ...values } = input;
    await context.env.db
      .update(league)
      .set(values)
      .where(eq(league.id, leagueId));
  });

const deleteLeague = pub.league.delete
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    await context.env.db.delete(league).where(eq(league.id, input.leagueId));
  });

const listLeagueMembers = pub.league.member.list
  .use(leagueMemberGuard)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.leaguePlayer.findMany({
      where: (lp, { eq }) => eq(lp.leagueId, input.leagueId),
      with: {
        user: true,
      },
    });
    return res;
  });

const getLeagueMember = pub.league.member.get
  .use(leagueMemberGuard)
  .handler(async ({ input, context }) => {
    const res: LeagueMember | undefined =
      await context.env.db.query.leaguePlayer.findFirst({
        where: (lp, { and, eq }) =>
          and(eq(lp.leagueId, input.leagueId), eq(lp.playerId, input.userId)),
        with: {
          user: true,
        },
      });

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const deleteLeagueMember = pub.league.member.delete
  .use(
    leagueMemberGuard.concat(
      ({ context, next }, input: GetLeagueMemberInput) => {
        if (context.leagueRole === "owner" || context.userId === input.userId)
          return next();

        throw new ORPCError("UNAUTHORIZED");
      },
    ),
  )
  .handler(async ({ input, context }) => {
    await context.env.db
      .delete(leaguePlayer)
      .where(
        and(
          eq(leaguePlayer.leagueId, input.leagueId),
          eq(leaguePlayer.playerId, input.userId),
          ne(leaguePlayer.role, "owner"),
        ),
      );
  });

const listInviteCodes = pub.league.inviteCode.list
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    const codes = await context.env.db
      .select()
      .from(inviteCode)
      .where(eq(inviteCode.leagueId, input.leagueId));
    return codes;
  });

const createInviteCode = pub.league.inviteCode.create
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    const code = generateBase36Code();

    const insertRes = await context.env.db.transaction(async (tx) => {
      const countRes = tx
        .select({ count: count() })
        .from(inviteCode)
        .where(eq(inviteCode.leagueId, input.leagueId))
        .get()!;

      if (countRes.count >= MAX_INVITE_COUNT) {
        throw new ORPCError("CONFLICT", {
          message: `cannot exceed ${MAX_INVITE_COUNT} invite codes`,
        });
      }

      const insertRes = context.env.db
        .insert(inviteCode)
        .values({ code, leagueId: input.leagueId, active: true })
        .returning()
        .get();

      return insertRes;
    });

    return insertRes;
  });

const updateInviteCode = pub.league.inviteCode.update
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    const { leagueId, code, ...values } = input;
    const res = context.env.db
      .update(inviteCode)
      .set(values)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)))
      .returning()
      .get();
    return res;
  });

const deleteInviteCode = pub.league.inviteCode.delete
  .use(leagueOwnerGuard)
  .handler(async ({ input, context }) => {
    const { leagueId, code } = input;
    await context.env.db
      .delete(inviteCode)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)));
  });

export const leagueRoutes = {
  list: listLeague,
  get: getLeague,
  create: createLeague,
  join: joinLeague,
  update: updateLeague,
  delete: deleteLeague,
  member: {
    list: listLeagueMembers,
    get: getLeagueMember,
    delete: deleteLeagueMember,
  },
  inviteCode: {
    list: listInviteCodes,
    create: createInviteCode,
    update: updateInviteCode,
    delete: deleteInviteCode,
  },
};
