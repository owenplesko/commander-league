import {
  sqliteTable,
  check,
  text,
  blob,
  primaryKey,
  integer,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import {
  leagueRoleValues,
  type CardData,
} from "@commander-league/contract/schemas";

export const card = sqliteTable("card", {
  name: text().primaryKey().notNull(),
  data: blob({ mode: "json" }).$type<CardData>().notNull(),
});

export const collectionCard = sqliteTable(
  "collection_card",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    leagueId: integer("league_id")
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    cardName: text("card_name")
      .notNull()
      .references(() => card.name),
    quantity: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.leagueId, table.cardName],
      name: "collection_card_pk",
    }),
    check("collection_card_quantity_check", sql`quantity > 0`),
  ],
);

export const league = sqliteTable("league", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
});

export const leagueMember = sqliteTable(
  "league_member",
  {
    leagueId: integer("league_id")
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: leagueRoleValues }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.leagueId, table.userId],
      name: "league_member_pk",
    }),
  ],
);

export const inviteCode = sqliteTable("invite_code", {
  code: text().notNull().primaryKey(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => league.id, { onDelete: "cascade" }),
  active: integer({ mode: "boolean" }).notNull(),
  uses: integer().default(0).notNull(),
});

export const tradeRequest = sqliteTable("trade_request", {
  id: integer().primaryKey().notNull(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => league.id, { onDelete: "cascade" }),
  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  requesterAccept: integer({ mode: "boolean" }).default(false).notNull(),
  recipientId: text("recipient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  recipientAccept: integer({ mode: "boolean" }).default(false).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const tradeRequestCard = sqliteTable(
  "trade_request_card",
  {
    tradeId: integer("trade_id")
      .notNull()
      .references(() => tradeRequest.id),
    cardName: text("card_name")
      .notNull()
      .references(() => card.name),
    role: text({ enum: ["requester", "recipient"] }).notNull(),
    quantity: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.tradeId, table.cardName, table.role],
      name: "trade_request_card_pk",
    }),
  ],
);

// auth stuff
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);
