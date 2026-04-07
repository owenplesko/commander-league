import { inviteCode, league, leagueMember } from "../db/schema";
import { and, count, eq, ne } from "drizzle-orm";
import type { League } from "@commander-league/contract/schemas";
import { MAX_INVITE_COUNT } from "@commander-league/contract/constants";
import { ORPCError } from "@orpc/server";
import { generateBase36Code } from "../lib/generateInviteCode";
import { base } from "../orpc";
import {
  memberOfLeague,
  leagueOwner,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";
import { authGuard } from "../middleware/auth";
import { createLeagueMember } from "../procedures/leagueMember";

// TODO: add a search param for userId instead of getting from auth
const listLeague = base.league.list
  .use(authGuard)
  .handler(async ({ context }) => {
    const leagues: League[] = await context.env.db
      .select({ id: league.id, name: league.name })
      .from(league)
      .innerJoin(leagueMember, eq(league.id, leagueMember.leagueId))
      .where(eq(leagueMember.userId, context.userId));
    return leagues;
  });

const getLeague = base.league.get
  .use(memberOfLeague)
  .handler(({ input, context }) => {
    const res: League | undefined = context.env.db
      .select({ id: league.id, name: league.name })
      .from(league)
      .where(eq(league.id, input.leagueId))
      .get();

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const createLeague = base.league.create
  .use(authGuard)
  .handler(({ input, context }) => {
    const newLeague = context.env.db.transaction((tx) => {
      const newLeague = tx.insert(league).values(input).returning().get();

      createLeagueMember(tx, {
        leagueId: newLeague.id,
        userId: context.userId,
        role: "owner",
      });

      return newLeague;
    });

    return newLeague;
  });

const joinLeague = base.league.join
  .use(authGuard)
  .handler(({ input, context }) => {
    const leagueRes = context.env.db.transaction((tx) => {
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

      createLeagueMember(tx, {
        leagueId: leagueRes.league.id,
        userId: context.userId,
        role: "player",
      }).run();

      tx.update(inviteCode)
        .set({ uses: leagueRes.invite_code.uses + 1 })
        .where(eq(inviteCode.code, input.inviteCode))
        .run();

      return leagueRes.league;
    });

    return leagueRes;
  });

const updateLeague = base.league.update
  .use(leagueOwner)
  .handler(async ({ input, context }) => {
    const { leagueId, ...values } = input;
    await context.env.db
      .update(league)
      .set(values)
      .where(eq(league.id, leagueId));
  });

const deleteLeague = base.league.delete
  .use(leagueOwner)
  .handler(({ input, context }) => {
    context.env.db.delete(league).where(eq(league.id, input.leagueId)).run();
  });

const listLeagueMembers = base.league.member.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const member = await context.env.db.query.leagueMember.findMany({
      where: {
        leagueId: input.leagueId,
      },
      with: {
        user: true,
      },
    });

    return member;
  });

const getLeagueMember = base.league.member.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.leagueMember.findFirst({
      where: {
        leagueId: input.leagueId,
        userId: input.userId,
      },
      with: {
        user: true,
      },
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const deleteLeagueMember = base.league.member.delete
  .use(selfOrLeagueOwner)
  .handler(({ input, context }) => {
    context.env.db
      .delete(leagueMember)
      .where(
        and(
          eq(leagueMember.leagueId, input.leagueId),
          eq(leagueMember.userId, input.userId),
          ne(leagueMember.role, "owner"),
        ),
      )
      .run();
  });

const listInviteCodes = base.league.inviteCode.list
  .use(leagueOwner)
  .handler(({ input, context }) => {
    const codes = context.env.db
      .select()
      .from(inviteCode)
      .where(eq(inviteCode.leagueId, input.leagueId))
      .all();
    return codes;
  });

const createInviteCode = base.league.inviteCode.create
  .use(leagueOwner)
  .handler(({ input, context }) => {
    const code = generateBase36Code();

    const insertRes = context.env.db.transaction((tx) => {
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

const updateInviteCode = base.league.inviteCode.update
  .use(leagueOwner)
  .handler(({ input, context }) => {
    const { leagueId, code, ...values } = input;
    const res = context.env.db
      .update(inviteCode)
      .set(values)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)))
      .returning()
      .get();
    return res;
  });

const deleteInviteCode = base.league.inviteCode.delete
  .use(leagueOwner)
  .handler(({ input: { leagueId, code }, context }) => {
    context.env.db
      .delete(inviteCode)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)))
      .run();
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
