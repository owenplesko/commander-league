import {
  sqliteTable,
  text,
  blob,
  primaryKey,
  integer,
  index,
  foreignKey,
  check,
} from "drizzle-orm/sqlite-core";
import {
  leagueRoleValues,
  type CardData,
} from "@commander-league/contract/schemas";
import { sql } from "drizzle-orm";

export const card = sqliteTable("card", {
  name: text().primaryKey().notNull(),
  data: blob({ mode: "json" }).$type<CardData>().notNull(),
});

export const collection = sqliteTable("collection", {
  id: integer().primaryKey().notNull(),
});

export const collectionCard = sqliteTable(
  "collection_card",
  {
    collectionId: integer()
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    cardName: text()
      .notNull()
      .references(() => card.name),
    quantity: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.collectionId, table.cardName],
      name: "collection_card_pk",
    }),
    check("collection_card_quantity_check", sql`${table.quantity} > 0`),
  ],
);

export const league = sqliteTable("league", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
});

export const leagueMember = sqliteTable(
  "league_member",
  {
    leagueId: integer()
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    role: text({ enum: leagueRoleValues }).notNull(),
    collectionId: integer()
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
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
  leagueId: integer()
    .notNull()
    .references(() => league.id, { onDelete: "cascade" }),
  active: integer({ mode: "boolean" }).notNull(),
  uses: integer().default(0).notNull(),
});

const tradeStatusValues = ["accepted", "pending", "rejected"] as const;

export const tradeRequest = sqliteTable("trade_request", {
  id: integer().primaryKey().notNull(),
  leagueId: integer()
    .notNull()
    .references(() => league.id, { onDelete: "cascade" }),
  ownerId: text()
    .notNull()
    .references(() => user.id),
});

export const tradeSide = sqliteTable(
  "trade_side",
  {
    tradeId: integer()
      .notNull()
      .references(() => tradeRequest.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    status: text({ enum: tradeStatusValues }).default("pending").notNull(),
    collectionId: integer()
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.tradeId, table.userId],
      name: "trade_side_pk",
    }),
  ],
);

export const deck = sqliteTable(
  "deck",
  {
    id: integer().primaryKey().notNull(),
    leagueId: integer()
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    name: text().notNull(),
    displayCardName: text().references(() => card.name),
    collectionId: integer()
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
  },
  (table) => [
    foreignKey({
      columns: [table.leagueId, table.userId],
      foreignColumns: [leagueMember.leagueId, leagueMember.userId],
    }).onDelete("cascade"),
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
      .references(() => user.id),
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
      .references(() => user.id),
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
