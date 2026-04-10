import type { LeagueRole } from "@commander-league/contract/schemas";
import type { TX } from "../db";
import { leagueMember } from "../db/schema";
import { createCollection } from "./collection";

export function createLeagueMember(
  tx: TX,
  params: { leagueId: number; userId: string; role: LeagueRole },
) {
  const { collectionId } = createCollection(tx);

  tx.insert(leagueMember)
    .values({ collectionId, ...params })
    .run();
}
