import { relations } from "drizzle-orm/relations";
import { card, collectionCard, league, deck, deckCard, leaguePlayer, user, session, account } from "./schema";

export const collectionCardRelations = relations(collectionCard, ({one}) => ({
	card: one(card, {
		fields: [collectionCard.cardName],
		references: [card.name]
	}),
	league: one(league, {
		fields: [collectionCard.leagueId],
		references: [league.id]
	}),
}));

export const cardRelations = relations(card, ({many}) => ({
	collectionCards: many(collectionCard),
	deckCards: many(deckCard),
}));

export const leagueRelations = relations(league, ({many}) => ({
	collectionCards: many(collectionCard),
	decks: many(deck),
	leaguePlayers: many(leaguePlayer),
}));

export const deckRelations = relations(deck, ({one, many}) => ({
	league: one(league, {
		fields: [deck.leagueId],
		references: [league.id]
	}),
	deckCards: many(deckCard),
}));

export const deckCardRelations = relations(deckCard, ({one}) => ({
	card: one(card, {
		fields: [deckCard.cardName],
		references: [card.name]
	}),
	deck: one(deck, {
		fields: [deckCard.deckId],
		references: [deck.id]
	}),
}));

export const leaguePlayerRelations = relations(leaguePlayer, ({one}) => ({
	league: one(league, {
		fields: [leaguePlayer.leagueId],
		references: [league.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));