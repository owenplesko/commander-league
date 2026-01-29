// some of these types are broken but some are working, these r just scripts so idk to fix rn

import { Database } from "bun:sqlite";
import data from "./AtomicCards.json";
const cardData: Record<string, CardAtomic[]> = data.data;

const db = new Database("./back/db.sqlite");

const insertCard = db.prepare(`
  INSERT INTO card (name, data)
  VALUES(?, ?)
`);

const insertCards = db.transaction((rows) => {
  for (const row of rows) {
    insertCard.run(row.name, row.data);
  }
});

insertCards(
  Object.entries(cardData).map(([name, data]) => ({
    name: String(name),
    data: JSON.stringify({
      manaValue: data[0].manaValue,
      colorIdentity: data[0].colorIdentity,
      printings: data[0].printings ?? [],
    }),
  })),
);

db.close(false);
