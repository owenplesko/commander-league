import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  collection: {
    cardQuantities: r.many.collectionCard({
      from: r.collection.id,
      to: r.collectionCard.collectionId,
    }),
  },
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
    collection: r.one.collection({
      from: r.leagueMember.collectionId,
      to: r.collection.id,
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
    user: r.one.user({
      from: r.tradeSide.userId,
      to: r.user.id,
      optional: false,
    }),
    cardQuantities: r.many.collectionCard({
      from: r.tradeSide.collectionId,
      to: r.collectionCard.collectionId,
    }),
  },
  deck: {
    owner: r.one.user({ from: r.deck.userId, to: r.user.id, optional: false }),
    cardQuantities: r.many.collectionCard({
      from: r.deck.collectionId,
      to: r.collectionCard.collectionId,
    }),
  },
}));
