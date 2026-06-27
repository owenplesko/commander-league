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
    requester: r.one.member({
      from: r.tradeRequest.requesterId,
      to: r.member.userId,
      optional: false,
    }),
    requesterCardQuantities: r.many.collectionCard({
      from: r.tradeRequest.requesterCollectionId,
      to: r.collectionCard.collectionId,
    }),
    recipient: r.one.member({
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
    owner: r.one.member({
      from: r.deck.userId,
      to: r.member.userId,
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
  packOffering: {
    pack: r.one.pack({
      from: r.packOffering.packId,
      to: r.pack.id,
      optional: false,
    }),
  },
  pack: {
    structures: r.many.packStructure({
      from: r.pack.id,
      to: r.packStructure.packId,
    }),
  },
  packStructure: {
    slots: r.many.packStructureSlot({
      from: [r.packStructure.packId, r.packStructure.index],
      to: [r.packStructureSlot.packId, r.packStructureSlot.structureIndex],
    }),
  },
  packStructureSlot: {
    cardPool: r.one.packPool({
      from: r.packStructureSlot.poolId,
      to: r.packPool.id,
      optional: false,
    }),
  },
  packPool: {
    cardQuantities: r.many.collectionCard({
      from: r.packPool.collectionId,
      to: r.collectionCard.collectionId,
    }),
  },
}));
