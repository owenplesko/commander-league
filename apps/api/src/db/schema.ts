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
  tradeStatusValues,
  type CardData,
} from "@commander-league/contract/schemas";
import { sql } from "drizzle-orm";

export const settings = sqliteTable(
  "settings",
  {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    ownerId: text()
      .notNull()
      .references(() => member.userId),
  },
  (t) => [check("settings_singleton_check", sql`${t.id} = 1`)],
);

export const card = sqliteTable("card", {
  name: text().primaryKey().notNull(),
  data: blob({ mode: "json" }).$type<CardData>().notNull(),
});

export const cardAlias = sqliteTable(
  "card_alias",
  {
    cardName: text()
      .notNull()
      .references(() => card.name),
    alias: text().notNull(),
  },
  (t) => [primaryKey({ columns: [t.alias, t.cardName] })],
);

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

export const member = sqliteTable("league_member", {
  userId: text()
    .notNull()
    .primaryKey()
    .references(() => user.id),
  admin: integer({ mode: "boolean" }).notNull(),
  packPoints: integer().notNull().default(0),
  collectionId: integer()
    .notNull()
    .references(() => collection.id),
});

export const tradeRequest = sqliteTable("trade_request", {
  id: integer().primaryKey().notNull(),
  requesterId: text()
    .notNull()
    .references(() => member.userId),
  requesterStatus: text({ enum: tradeStatusValues }).notNull(),
  requesterCollectionId: integer()
    .notNull()
    .references(() => collection.id),
  recipientId: text()
    .notNull()
    .references(() => member.userId),
  recipientStatus: text({ enum: tradeStatusValues }).notNull(),
  recipientCollectionId: integer()
    .notNull()
    .references(() => collection.id),
});

export const deck = sqliteTable("deck", {
  id: integer().primaryKey().notNull(),
  userId: text()
    .notNull()
    .references(() => member.userId),
  name: text().notNull(),
  commanderCardName: text()
    .references(() => card.name)
    .notNull(),
  partnerCardName: text().references(() => card.name),
  collectionId: integer()
    .notNull()
    .references(() => collection.id),
});

export const pack = sqliteTable("pack", {
  id: text().notNull().primaryKey(),
  name: text().notNull(),
});

export const packOffering = sqliteTable(
  "pack_offering",
  {
    packId: text()
      .notNull()
      .references(() => pack.id, { onDelete: "cascade" }),
    cost: integer().notNull(),
  },
  (t) => [check("pack_offering_cost", sql`${t.cost} >= 0`)],
);

export const packPool = sqliteTable(
  "pack_card_pool",
  {
    id: text().notNull(),
    packId: text()
      .notNull()
      .references(() => pack.id, { onDelete: "cascade" }),
    collectionId: integer()
      .notNull()
      .references(() => collection.id),
  },
  (t) => [primaryKey({ columns: [t.packId, t.id] })],
);

export const packStructure = sqliteTable(
  "pack_structure",
  {
    index: integer().notNull(),
    packId: text()
      .notNull()
      .references(() => pack.id, { onDelete: "cascade" }),
    weight: integer().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.packId, t.index] }),
    check("pack_structure_weight_check", sql`${t.weight} > 0`),
  ],
);

export const packStructureSlot = sqliteTable(
  "pack_structure_slot",
  {
    packId: text().notNull(),
    structureIndex: integer().notNull(),
    poolId: text().notNull(),
    count: integer().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.packId, t.structureIndex, t.poolId] }),
    // ensure that the packStructure and packPool references are all within the same pack
    foreignKey({
      columns: [t.packId, t.structureIndex],
      foreignColumns: [packStructure.packId, packStructure.index],
    }).onDelete("cascade"),
    foreignKey({
      columns: [t.packId, t.poolId],
      foreignColumns: [packPool.packId, packPool.id],
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
