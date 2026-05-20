import { gunzipSync } from "zlib";
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import type { Set } from "./types/mtg";
import type { card } from "../src/db/schema";

const CACHE_DIR = join(import.meta.dirname, "/cache");
const GZ_PATH = join(CACHE_DIR, "AllPrintings.json.gz");
const JSON_PATH = join(CACHE_DIR, "AllPrintings.json");
const URL = "https://mtgjson.com/api/v5/AllPrintings.json.gz";

mkdirSync(CACHE_DIR, { recursive: true });

export async function downloadAllPrintings(): Promise<void> {
  console.log("Downloading AllPrintings.json.gz...");
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(
      `Failed to download: ${response.status} ${response.statusText}`,
    );
  }
  const buffer = await response.arrayBuffer();
  const compressed = Buffer.from(buffer);
  console.log("Decompressing...");
  const decompressed = gunzipSync(compressed);
  if (existsSync(JSON_PATH)) {
    console.log("AllPrintings.json already exists, overwriting...");
  }
  writeFileSync(JSON_PATH, decompressed);
  console.log("Saved AllPrintings.json");
  if (existsSync(GZ_PATH)) {
    unlinkSync(GZ_PATH);
    console.log("Cleaning up AllPrintings.json.gz");
  }
}

export async function getAllPrintings(): Promise<Record<string, Set>> {
  if (!existsSync(JSON_PATH)) {
    console.log("AllPrintings.json not found, downloading...");
    await downloadAllPrintings();
  }
  const file = await Bun.file(JSON_PATH).json();
  return file.data as Record<string, Set>;
}

export async function getCardData(): Promise<
  Record<string, typeof card.$inferInsert>
> {
  const sets = await getAllPrintings();
  const cardData: Record<string, typeof card.$inferInsert> = {};

  for (const [_, set] of Object.entries(sets)) {
    for (const card of set.cards) {
      const name = card.name;
      const scryfallId = card.identifiers.scryfallId;
      const faceName = card.faceName;

      if (!scryfallId) continue;
      if (faceName?.includes("Start"))
        console.log(`face: ${faceName} card: ${name}`);
      if (!faceName) continue;

      if (!cardData[name]) {
        cardData[name] = {
          name,
          faceName,
          data: {
            manaValue: card.manaValue,
            colorIdentity: card.colorIdentity,
            rarity: card.rarity,
            types: card.types,
            subTypes: card.subtypes,
            printings: [],
          },
        };
      }

      cardData[name]!.data.printings.push({
        set: card.setCode,
        number: card.number,
        scryfallId,
      });
    }
  }

  return cardData;
}

export async function getCardUUIDToName(): Promise<Record<string, string>> {
  const sets = await getAllPrintings();
  const map: Record<string, string> = {};

  for (const [_, set] of Object.entries(sets)) {
    for (const card of set.cards) {
      map[card.uuid] = card.name;
    }
  }

  return map;
}
