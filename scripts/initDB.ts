// some of these types are broken but some are working, these r just scripts so idk to fix rn

import { Database } from "bun:sqlite";
import data from "./AtomicCards.json";
const cardData: Record<string, CardAtomic[]> = data.data;

const db = new Database("./back/db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS card (
  name TEXT PRIMARY KEY NOT NULL,
  data BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS player ( 
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS league ( 
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS league_player ( 
  league_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('owner', 'admin', 'player')),
  PRIMARY KEY(league_id, player_id),
  FOREIGN KEY(league_id) REFERENCES league(id),
  FOREIGN KEY(player_id) REFERENCES player(id)
);

CREATE TABLE IF NOT EXISTS collection_card (
  player_id INTEGER NOT NULL,
  league_id INTEGER NOT NULL,
  card_name INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(league_id, player_id, card_name), 
  FOREIGN KEY(league_id) REFERENCES league(id),
  FOREIGN KEY(player_id) REFERENCES player(id),
  FOREIGN KEY(card_name) REFERENCES card(name)
);

CREATE TABLE IF NOT EXISTS deck (
  id INTEGER PRIMARY KEY NOT NULL,
  player_id INTEGER NOT NULL,
  league_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY(league_id) REFERENCES league(id),
  FOREIGN KEY(player_id) REFERENCES player(id)
);

CREATE TABLE IF NOT EXISTS deck_card (
  deck_id INTEGER NOT NULL,
  card_name INTEGER NOT NULL,
  PRIMARY KEY(deck_id, card_name),
  FOREIGN KEY(deck_id) REFERENCES deck(id),
  FOREIGN KEY(card_name) REFERENCES card(name)
);
`);

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
