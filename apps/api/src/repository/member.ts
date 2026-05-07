import db, { type TX } from "../db";
import { member } from "../db/schema";

export function getMember({ userId }: { userId: string }) {
  const res = db.query.member.findFirst({ where: { userId } }).sync();
  return res;
}

export function insertMember(
  values: { userId: string; collectionId: number; admin: boolean },
  tx: TX,
) {
  tx.insert(member).values(values).run();
}
