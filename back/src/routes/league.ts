import { base } from "./base";
import { league, leaguePlayer } from "../db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export const leagueRoutes = {
  // TODO: add a search param for userId instead of getting from auth
  list: base
    .route({
      method: "GET",
      path: "/league",
    })
    .handler(({ context }) => {
      return context.env.db
        .select({ id: league.id, name: league.name })
        .from(league)
        .innerJoin(leaguePlayer, eq(league.id, leaguePlayer.leagueId))
        .where(eq(leaguePlayer.playerId, context.userId));
    }),

  get: base
    .route({
      method: "GET",
      path: "/league/{leagueId}",
    })
    .input(z.object({ leagueId: z.coerce.number() }))
    .handler(({ input, context }) => {
      return context.env.db
        .select({ id: league.id, name: league.name })
        .from(league)
        .where(eq(league.id, input.leagueId))
        .get();
    }),

  create: base
    .route({ method: "POST", path: "/league" })
    .input(z.object({ name: z.string().min(1).max(50) }))
    .handler(async ({ input, context }) => {
      await context.env.db.transaction(async (tx) => {
        const res = await tx
          .insert(league)
          .values(input)
          .returning({ id: league.id });
        const leagueId = res[0]!.id;
        await tx
          .insert(leaguePlayer)
          .values({ leagueId, playerId: context.userId, role: "owner" });
      });
    }),

  delete: base
    .route({ method: "DELETE", path: "/league/{leagueId}" })
    .input(z.object({ leagueId: z.coerce.number() }))
    .handler(({ input, context }) => {
      context.env.db.delete(league).where(eq(league.id, input.leagueId));
    }),
};
