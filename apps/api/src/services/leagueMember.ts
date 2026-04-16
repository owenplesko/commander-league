import type { LeagueRole } from "@commander-league/contract/schemas";
import type { QueryClient } from "../db";
import { leagueMember } from "../db/schema";
import { createCollection } from "./collection";
import db from "../db";
import { withTransaction } from "../db/helper";

export function createLeagueMember({
  leagueId,
  userId,
  role,
  qc = db,
}: {
  leagueId: number;
  userId: string;
  role: LeagueRole;
  qc?: QueryClient;
}) {
  withTransaction(qc, (tx) => {
    const { collectionId } = createCollection({});

    tx.insert(leagueMember)
      .values({ collectionId, leagueId, userId, role })
      .run();
  });
}

export function getLeagueMemberCollectionId({
  leagueId,
  userId,
  qc = db,
}: {
  leagueId: number;
  userId: string;
  qc?: QueryClient;
}) {
  const res = qc.query.leagueMember
    .findFirst({
      columns: { collectionId: true },
      where: { userId, leagueId },
    })
    .sync();

  return res?.collectionId;
}
