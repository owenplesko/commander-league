import { card, cardAlias } from "../src/db/schema";
import { getCardData } from "./allPrintings";
import db from "../src/db";
import { sql } from "drizzle-orm";

const cardData = await getCardData();

const rows = Object.values(cardData);

const BATCH_SIZE = 10000;

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const cardInserts = rows.slice(i, i + BATCH_SIZE);

  await db
    .insert(card)
    .values(cardInserts)
    .onConflictDoUpdate({
      target: card.name,
      set: { data: sql`excluded.data` },
    });

  const cardAliasInserts = rows.flatMap(({ name }) => {
    const aliases = name.split(" // ");
    if (aliases.length <= 1) return [];

    return aliases.map((alias) => ({ cardName: name, alias }));
  });

  await db.insert(cardAlias).values(cardAliasInserts).onConflictDoNothing();

  console.log(
    `Inserted ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} cards`,
  );
}
