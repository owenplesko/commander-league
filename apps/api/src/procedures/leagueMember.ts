import type { LeagueRole } from "@commander-league/contract/schemas";
import type { TX } from "../db";
import { collection, leagueMember } from "../db/schema";

export function createLeagueMember(
  tx: TX,
  params: { leagueId: number; userId: string; role: LeagueRole },
) {
  const { id: collectionId } = tx
    .insert(collection)
    .values({})
    .returning()
    .get();

  tx.insert(leagueMember)
    .values({ collectionId, ...params })
    .run();
}
