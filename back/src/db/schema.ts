import {
  sqliteTable,
  type AnySQLiteColumn,
  check,
  text,
  blob,
  integer,
  foreignKey,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { CardData } from "../schemas/card";

export const card = sqliteTable("card", {
  name: text().primaryKey().notNull(),
  data: blob({ mode: "json" }).$type<CardData>().notNull(),
});

export const player = sqliteTable("player", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
});

export const league = sqliteTable("league", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
});

export const leaguePlayer = sqliteTable(
  "league_player",
  {
    leagueId: integer("league_id")
      .notNull()
      .references(() => league.id),
    playerId: integer("player_id")
      .notNull()
      .references(() => player.id),
    role: text().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.leagueId, table.playerId],
      name: "league_player_league_id_player_id_pk",
    }),
    check("league_player_check_1", sql`role IN ('owner', 'admin', 'player'`),
  ],
);

export const collectionCard = sqliteTable(
  "collection_card",
  {
    playerId: integer("player_id")
      .notNull()
      .references(() => player.id),
    leagueId: integer("league_id")
      .notNull()
      .references(() => league.id),
    cardName: text("card_name")
      .notNull()
      .references(() => card.name),
    quantity: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.playerId, table.leagueId, table.cardName],
      name: "collection_card_player_id_league_id_card_name_pk",
    }),
    check("collection_card_check_1", sql`quantity > 0`),
  ],
);

export const deck = sqliteTable("deck", {
  id: integer().primaryKey().notNull(),
  playerId: integer("player_id")
    .notNull()
    .references(() => player.id),
  leagueId: integer("league_id")
    .notNull()
    .references(() => league.id),
  name: text().notNull(),
});

export const deckCard = sqliteTable(
  "deck_card",
  {
    deckId: integer("deck_id")
      .notNull()
      .references(() => deck.id),
    cardName: text("card_name")
      .notNull()
      .references(() => card.name),
  },
  (table) => [
    primaryKey({
      columns: [table.deckId, table.cardName],
      name: "deck_card_deck_id_card_name_pk",
    }),
  ],
);
