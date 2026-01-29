import {
  sqliteTable,
  check,
  text,
  blob,
  primaryKey,
  integer,
  numeric,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const card = sqliteTable("card", {
  name: text().primaryKey().notNull(),
  data: blob().notNull(),
});

export const collectionCard = sqliteTable(
  "collection_card",
  {
    playerId: text("player_id").notNull(),
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
  playerId: text("player_id").notNull(),
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
    playerId: text("player_id").notNull(),
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

export const user = sqliteTable("user", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: integer().notNull(),
  image: text(),
  createdAt: numeric().notNull(),
  updatedAt: numeric().notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: numeric().notNull(),
    token: text().notNull(),
    createdAt: numeric().notNull(),
    updatedAt: numeric().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: numeric(),
    refreshTokenExpiresAt: numeric(),
    scope: text(),
    password: text(),
    createdAt: numeric().notNull(),
    updatedAt: numeric().notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: numeric().notNull(),
    createdAt: numeric().notNull(),
    updatedAt: numeric().notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);
