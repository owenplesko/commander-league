import db from "../src/db";
import {
  pack,
  packPool,
  collectionCard,
  packStructure,
  packStructureSlot,
} from "../src/db/schema";
import { insertCollection } from "../src/repository";
import { getAllPrintings, getCardUUIDToName } from "./allPrintings";
import type { Pack } from "./types/cardPack";
import type { BoosterConfig } from "./types/mtg";

const sets = await getAllPrintings();
const uuidToCardName = await getCardUUIDToName();

function transformToPack(
  cfg: BoosterConfig,
  setCode: string,
  packCode: string,
): Pack {
  const pack: Pack = {
    id: `${setCode}-${packCode}`,
    name: cfg.name ?? `${setCode} Default`,
    structures: cfg.boosters.map((b) => ({
      weight: b.weight,
      slots: Object.fromEntries(
        Object.entries(b.contents).map(([k, v]) => [k, v ?? 0]),
      ),
    })),
    cardPools: Object.fromEntries(
      Object.entries(cfg.sheets).map(([k, v]) => [
        k,
        Object.fromEntries(
          Object.entries(v.cards).map(([k, v]) => [uuidToCardName[k], v]),
        ),
      ]),
    ),
  };

  return pack;
}

function insertPack(input: Pack) {
  return db.transaction((tx) => {
    const result = tx
      .insert(pack)
      .values({ id: input.id, name: input.name })
      .onConflictDoNothing()
      .returning({ id: pack.id })
      .get();

    if (!result) return;
    const packId = result.id;

    // Insert pools — each pool gets its own collection of cards
    for (const [poolId, cardPool] of Object.entries(input.cardPools)) {
      const { id: collectionId } = insertCollection(tx);
      tx.insert(packPool).values({ id: poolId, packId, collectionId }).run();
      const cardRows = Object.entries(cardPool).map(([cardName, quantity]) => ({
        collectionId,
        cardName,
        quantity,
      }));
      if (cardRows.length > 0) {
        tx.insert(collectionCard).values(cardRows).run();
      }
    }

    // Insert structures and their slots
    input.structures.forEach((structure, index) => {
      tx.insert(packStructure)
        .values({ packId, index, weight: structure.weight })
        .run();
      for (const [poolId, count] of Object.entries(structure.slots)) {
        tx.insert(packStructureSlot)
          .values({ packId, structureIndex: index, poolId, count })
          .run();
      }
    });

    return { packId };
  });
}

for (const [setCode, set] of Object.entries(sets)) {
  for (const [packCode, pack] of Object.entries(set.booster ?? {})) {
    insertPack(transformToPack(pack, setCode, packCode));
  }
}
