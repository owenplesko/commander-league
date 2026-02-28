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
    requester: r.one.user({
      from: r.tradeRequest.requesterId,
      to: r.user.id,
      optional: false,
    }),
    requesterItems: r.one.tradeItems({
      from: r.tradeRequest.id,
      to: r.tradeItems.tradeId,
      where: {
        role: "requester",
      },
    }),
    recipient: r.one.user({
      from: r.tradeRequest.recipientId,
      to: r.user.id,
      optional: false,
    }),
    recipientItems: r.one.tradeItems({
      from: r.tradeRequest.id,
      to: r.tradeItems.tradeId,
      where: {
        role: "recipient",
      },
    }),
  },
  tradeItems: {
    cards: r.many.tradeItemCard({
      from: r.tradeItems.id,
      to: r.tradeItemCard.tradeItemId,
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
