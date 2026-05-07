import type { TX } from "../db";
import * as repo from "../repository";
import { withTransaction } from "./util";

export function getMember({ userId }: { userId: string }) {
  const res = repo.getMember({ userId });
  return res;
}

export function createMember(
  { userId, admin = false }: { userId: string; admin?: boolean },
  tx?: TX,
) {
  withTransaction(tx, (tx) => {
    const { id: collectionId } = repo.insertCollection(tx);
    repo.insertMember({ userId, collectionId, admin }, tx);
  });
}
