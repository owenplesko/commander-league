import { card } from "../src/db/schema";
import type { CardData } from "@commander-league/contract/schemas";
import { getAllPrintings } from "./allPrintings";
import db from "../src/db";
import { sql } from "drizzle-orm";

const sets = await getAllPrintings();

let cardData: Record<string, CardData> = {};

for (const [_, set] of Object.entries(sets)) {
  for (const card of set.cards) {
    const name = card.name;
    const scryfallId = card.identifiers.scryfallId;

    if (!scryfallId) {
      console.log(`no scryfallId for card ${name}`);
      continue;
    }

    if (!cardData[name]) {
      cardData[name] = {
        manaValue: card.manaValue,
        colorIdentity: card.colorIdentity,
        rarity: card.rarity,
        types: card.types,
        subTypes: card.subtypes,
        printings: [],
      };
    }

    cardData[name].printings.push({
      set: card.setCode,
      number: card.number,
      scryfallId: scryfallId,
    });
  }
}

const rows = Object.entries(cardData).map(([name, data]) => ({ name, data }));

const BATCH_SIZE = 10000;

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  await db
    .insert(card)
    .values(batch)
    .onConflictDoUpdate({
      target: card.name,
      set: { data: sql`excluded.data` },
    });
  console.log(
    `Inserted ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} cards`,
  );
}
