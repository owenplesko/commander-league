import db, { type TX } from "../db";
import { member } from "../db/schema";

export function getMember({ userId }: { userId: string }) {
  const res = db.query.member
    .findFirst({ where: { userId }, with: { user: true } })
    .sync();
  return res;
}

export function insertMember(
  values: { userId: string; collectionId: number; admin: boolean },
  tx: TX,
) {
  tx.insert(member).values(values).run();
}

export function listMembers() {
  return db.query.member.findMany({ with: { user: true } }).sync();
}
