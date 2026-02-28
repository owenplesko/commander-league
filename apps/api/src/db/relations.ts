import { relations } from "drizzle-orm/relations";
import {
  card,
  collectionCard,
  league,
  leagueMember,
  tradeRequest,
  user,
} from "./schema";

export const collectionCardRelations = relations(collectionCard, ({ one }) => ({
  card: one(card, {
    fields: [collectionCard.cardName],
    references: [card.name],
  }),
}));

export const leagueRelations = relations(league, ({ many }) => ({
  leaguePlayers: many(leagueMember),
}));

export const leaguePlayerRelations = relations(leagueMember, ({ one }) => ({
  user: one(user, { fields: [leagueMember.userId], references: [user.id] }),
}));
