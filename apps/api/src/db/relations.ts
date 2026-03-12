import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  collectionCard: {
    card: r.one.card({
      from: r.collectionCard.cardName,
      to: r.card.name,
      optional: false,
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
  tradeRequest: {
    sides: r.many.tradeSide({
      from: r.tradeRequest.id,
      to: r.tradeSide.tradeId,
    }),
  },
  tradeSide: {
    cards: r.many.tradeItemCard({
      from: [r.tradeSide.tradeId, r.tradeSide.userId],
      to: [r.tradeItemCard.tradeId, r.tradeItemCard.userId],
    }),
    user: r.one.user({
      from: r.tradeSide.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  tradeItemCard: {
    card: r.one.card({
      from: r.tradeItemCard.cardName,
      to: r.card.name,
      optional: false,
    }),
  },
}));
