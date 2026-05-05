import { gunzipSync } from "zlib";
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import type { Set } from "./types/mtg";

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

  console.log("Done!");
}

export async function getAllPrintings(): Promise<Record<string, Set>> {
  if (!existsSync(JSON_PATH)) {
    console.log("AllPrintings.json not found, downloading...");
    await downloadAllPrintings();
  }

  const file = await Bun.file(JSON_PATH).json();
  const allPrintings = file.data as Record<string, Set>;

  return allPrintings;
}
