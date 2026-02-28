import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  collectionCard: {
    card: r.one.card({
      from: r.collectionCard.cardName,
      to: r.card.name,
    }),
  },
  league: {
    members: r.many.leagueMember({
      from: r.league.id,
      to: r.leagueMember.leagueId,
    }),
  },
  leagueMember: {
    user: r.one.user({
      from: r.leagueMember.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}));
