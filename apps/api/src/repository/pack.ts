import { sql } from "drizzle-orm";
import db from "../db";
import { packOffering } from "../db/schema";

export function setPackOfferings(values: { packId: string; cost: number }[]) {
  db.insert(packOffering)
    .values(values)
    .onConflictDoUpdate({
      target: [packOffering.packId],
      set: { cost: sql`excluded.cost` },
    })
    .run();
}
