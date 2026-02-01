import { eq, and } from "drizzle-orm";
import z from "zod";
import { user, leaguePlayer } from "../db/schema";
import { base } from "./base";

export const leaguePlayerRoutes = {
  list: base
    .route({ method: "GET", path: "/league/{leagueId}/player" })
    .input(z.object({ leagueId: z.coerce.number() }))
    .handler(({ input, context }) => {
      return context.env.db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          role: leaguePlayer.role,
        })
        .from(leaguePlayer)
        .innerJoin(user, eq(leaguePlayer.playerId, user.id))
        .where(eq(leaguePlayer.leagueId, input.leagueId));
    }),

  get: base
    .route({
      method: "GET",
      path: "/league/{leagueId}/player/{playerId}",
    })
    .input(z.object({ leagueId: z.coerce.number(), playerId: z.string() }))
    .handler(({ input, context }) => {
      return context.env.db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          role: leaguePlayer.role,
        })
        .from(leaguePlayer)
        .innerJoin(user, eq(leaguePlayer.playerId, user.id))
        .where(
          and(
            eq(leaguePlayer.leagueId, input.leagueId),
            eq(leaguePlayer.playerId, input.playerId),
          ),
        )
        .get();
    }),
};
