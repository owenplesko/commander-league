import { inArray, sql } from "drizzle-orm";
import db, { type DB, type TX } from "../db";
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

export function setMemberPackPoints(
  {
    userIds,
    value: packPoints,
  }: {
    userIds: string[];
    value: number;
  },
  tx: TX | DB = db,
) {
  tx.update(member)
    .set({ packPoints })
    .where(inArray(member.userId, userIds))
    .run();
}

export function incrementMemberPackPoints(
  {
    userIds,
    increment,
  }: {
    userIds: string[];
    increment: number;
  },
  tx: TX | DB = db,
) {
  tx.update(member)
    .set({
      packPoints: sql`${member.packPoints} + ${increment}`,
    })
    .where(inArray(member.userId, userIds))
    .run();
}
