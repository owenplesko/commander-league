import { sql } from "drizzle-orm";
import db from "../db";
import { pack, packOffering } from "../db/schema";

export function listPacks() {
  return db.select().from(pack).all();
}

export function setPackOfferings(values: { packId: string; cost: number }[]) {
  db.insert(packOffering)
    .values(values)
    .onConflictDoUpdate({
      target: [packOffering.packId],
      set: { cost: sql`excluded.cost` },
    })
    .run();
}

export function listPackOfferings() {
  return db.query.packOffering
    .findMany({
      with: {
        pack: true,
      },
    })
    .sync();
}
