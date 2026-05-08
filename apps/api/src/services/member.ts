import type { TX } from "../db";
import * as repo from "../repository";
import { withTransaction } from "./util";

export function createMember(
  { userId, admin = false }: { userId: string; admin?: boolean },
  tx?: TX,
) {
  withTransaction(tx, (tx) => {
    const { id: collectionId } = repo.insertCollection(tx);
    repo.insertMember({ userId, collectionId, admin }, tx);
  });
}

export const getMember = repo.getMember;
export const listMembers = repo.listMembers;
