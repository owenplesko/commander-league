import setData from "./AllPrintings.json";
import { Database } from "bun:sqlite";
import type { Set } from "./AllMTGJSONTypes.ts";
const sets = setData.data as Record<string, Set>;

// Get card printing set, number, scryfall id mapped to name by oracleId
type CardData = {
  manaValue: number;
  colorIdentity: string[];
  printings: {
    set: string;
    number: string;
    scryfallId: string;
  }[];
};

let cardData: Record<string, CardData> = {};

for (const [setName, set] of Object.entries(sets)) {
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

const db = new Database("./back/db.sqlite");

const insertCard = db.prepare(`
  INSERT INTO card (name, data)
  VALUES (?, ?)
  ON CONFLICT(name) DO UPDATE SET
    data = excluded.data
`);

const insertCards = db.transaction((rows: [name: string, data: CardData][]) => {
  for (const [name, data] of rows) {
    insertCard.run(name, JSON.stringify(data));
  }
});

insertCards(Object.entries(cardData));

db.close(false);
