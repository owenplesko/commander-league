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
    requester: r.one.user({
      from: r.tradeRequest.requesterId,
      to: r.user.id,
      optional: false,
    }),
    requesterCardQuantities: r.many.collectionCard({
      from: r.tradeRequest.requesterCollectionId,
      to: r.collectionCard.collectionId,
    }),
    requesterLeagueMembership: r.one.leagueMember({
      from: [r.tradeRequest.leagueId, r.tradeRequest.requesterId],
      to: [r.leagueMember.leagueId, r.leagueMember.userId],
      optional: false,
    }),
    recipient: r.one.user({
      from: r.tradeRequest.recipientId,
      to: r.user.id,
      optional: false,
    }),
    recipientCardQuantities: r.many.collectionCard({
      from: r.tradeRequest.recipientCollectionId,
      to: r.collectionCard.collectionId,
    }),
    recipientLeagueMembership: r.one.leagueMember({
      from: [r.tradeRequest.leagueId, r.tradeRequest.recipientId],
      to: [r.leagueMember.leagueId, r.leagueMember.userId],
      optional: false,
    }),
  },
  deck: {
    owner: r.one.user({ from: r.deck.userId, to: r.user.id, optional: false }),
    cardQuantities: r.many.collectionCard({
      from: r.deck.collectionId,
      to: r.collectionCard.collectionId,
    }),
    commanderCard: r.one.card({
      from: r.deck.commanderCardName,
      to: r.card.name,
      optional: false,
    }),
    partnerCard: r.one.card({
      from: r.deck.partnerCardName,
      to: r.card.name,
    }),
  },
}));
