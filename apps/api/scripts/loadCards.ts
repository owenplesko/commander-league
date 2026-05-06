import { card } from "../src/db/schema";
import { getCardData } from "./allPrintings";
import db from "../src/db";
import { sql } from "drizzle-orm";

const cardData = await getCardData();

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
