import { inviteCode, league, leaguePlayer } from "../db/schema";
import { and, count, eq } from "drizzle-orm";
import { base } from "./base";
import type { League, LeagueMember } from "@commander-league/contract/schemas";
import { MAX_INVITE_COUNT } from "@commander-league/contract/constants";
import { ORPCError } from "@orpc/server";
import { generateBase36Code } from "../lib/generateInviteCode";

// TODO: add a search param for userId instead of getting from auth
const listLeague = base.league.list.handler(async ({ context }) => {
  const leagues: League[] = await context.env.db
    .select({ id: league.id, name: league.name })
    .from(league)
    .innerJoin(leaguePlayer, eq(league.id, leaguePlayer.leagueId))
    .where(eq(leaguePlayer.playerId, context.userId));
  return leagues;
});

const getLeague = base.league.get.handler(({ input, context }) => {
  const res: League | undefined = context.env.db
    .select({ id: league.id, name: league.name })
    .from(league)
    .where(eq(league.id, input.leagueId))
    .get();

  if (!res) throw new ORPCError("NOT_FOUND");

  return res;
});

const createLeague = base.league.create.handler(async ({ input, context }) => {
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

const updateLeague = base.league.update.handler(async ({ input, context }) => {
  const { leagueId, ...values } = input;
  await context.env.db
    .update(league)
    .set(values)
    .where(eq(league.id, leagueId));
});

const deleteLeague = base.league.delete.handler(async ({ input, context }) => {
  await context.env.db.delete(league).where(eq(league.id, input.leagueId));
});

const listLeagueMembers = base.league.member.list.handler(
  async ({ input, context }) => {
    const res = await context.env.db.query.leaguePlayer.findMany({
      where: (lp, { eq }) => eq(lp.leagueId, input.leagueId),
      with: {
        user: true,
      },
    });
    return res;
  },
);

const getLeagueMember = base.league.member.get.handler(
  async ({ input, context }) => {
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
  },
);

const listInviteCodes = base.league.inviteCode.list.handler(
  async ({ input, context }) => {
    const codes = await context.env.db
      .select()
      .from(inviteCode)
      .where(eq(inviteCode.leagueId, input.leagueId));
    return codes;
  },
);

const createInviteCode = base.league.inviteCode.create.handler(
  async ({ input, context }) => {
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
  },
);

const updateInviteCode = base.league.inviteCode.update.handler(
  async ({ input, context }) => {
    const { leagueId, code, ...values } = input;
    const res = context.env.db
      .update(inviteCode)
      .set(values)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)))
      .returning()
      .get();
    return res;
  },
);

const deleteInviteCode = base.league.inviteCode.delete.handler(
  async ({ input, context }) => {
    const { leagueId, code } = input;
    await context.env.db
      .delete(inviteCode)
      .where(and(eq(inviteCode.leagueId, leagueId), eq(inviteCode.code, code)));
  },
);

export const leagueRoutes = {
  list: listLeague,
  get: getLeague,
  create: createLeague,
  update: updateLeague,
  delete: deleteLeague,
  member: {
    list: listLeagueMembers,
    get: getLeagueMember,
  },
  inviteCode: {
    list: listInviteCodes,
    create: createInviteCode,
    update: updateInviteCode,
    delete: deleteInviteCode,
  },
};
