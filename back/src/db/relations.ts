import { relations } from "drizzle-orm/relations";
import { player, leaguePlayer, league, card, collectionCard, deck, deckCard } from "./schema";

export const leaguePlayerRelations = relations(leaguePlayer, ({one}) => ({
	player: one(player, {
		fields: [leaguePlayer.playerId],
		references: [player.id]
	}),
	league: one(league, {
		fields: [leaguePlayer.leagueId],
		references: [league.id]
	}),
}));

export const playerRelations = relations(player, ({many}) => ({
	leaguePlayers: many(leaguePlayer),
	collectionCards: many(collectionCard),
	decks: many(deck),
}));

export const leagueRelations = relations(league, ({many}) => ({
	leaguePlayers: many(leaguePlayer),
	collectionCards: many(collectionCard),
	decks: many(deck),
}));

export const collectionCardRelations = relations(collectionCard, ({one}) => ({
	card: one(card, {
		fields: [collectionCard.cardName],
		references: [card.name]
	}),
	player: one(player, {
		fields: [collectionCard.playerId],
		references: [player.id]
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

export const deckRelations = relations(deck, ({one, many}) => ({
	player: one(player, {
		fields: [deck.playerId],
		references: [player.id]
	}),
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