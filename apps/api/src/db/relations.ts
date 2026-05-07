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
  member: {
    user: r.one.user({
      from: r.member.userId,
      to: r.user.id,
      optional: false,
    }),
    collection: r.one.collection({
      from: r.member.collectionId,
      to: r.collection.id,
      optional: false,
    }),
  },
  tradeRequest: {
    requester: r.one.user({
      from: r.tradeRequest.requesterId,
      to: r.member.userId,
      optional: false,
    }),
    requesterCardQuantities: r.many.collectionCard({
      from: r.tradeRequest.requesterCollectionId,
      to: r.collectionCard.collectionId,
    }),
    recipient: r.one.user({
      from: r.tradeRequest.recipientId,
      to: r.member.userId,
      optional: false,
    }),
    recipientCardQuantities: r.many.collectionCard({
      from: r.tradeRequest.recipientCollectionId,
      to: r.collectionCard.collectionId,
    }),
  },
  deck: {
    owner: r.one.user({
      from: r.deck.userId,
      to: r.user.id,
      optional: false,
    }),
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
