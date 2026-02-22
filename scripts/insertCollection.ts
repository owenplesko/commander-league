import { Database } from "bun:sqlite";
import { readFileSync } from "fs";

// Open the database
const db = new Database("./apps/api/db.sqlite");

db.run("PRAGMA foreign_keys = ON;");

// Prepare the insert statement
const insertCard = db.prepare(`
  INSERT INTO collection_card (user_id, league_id, card_name, quantity)
  VALUES('CshwFERMYdG443PLmR8xI9vJ4zvTK3mC', 1, ?, ?)
`);

// Read the collection file
const data = readFileSync("./scripts/collection.txt", "utf-8");

// Split into lines and process
for (const line of data.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue; // skip empty lines

  // Extract quantity (first number) and card name (rest of line)
  const match = trimmed.match(/^(\d+)\s+(.+)$/);
  if (!match) {
    console.warn("Skipping invalid line:", line);
    continue;
  }

  const quantity = parseInt(match[1], 10);
  const cardName = match[2];

  // Insert into the database
  insertCard.run(cardName, quantity);
  console.log(`Inserted: ${quantity} x ${cardName}`);
}

// Close the database
db.close(false);
console.log("Done importing collection.");
