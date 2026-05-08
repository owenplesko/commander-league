import { eq, getColumns, isNull } from "drizzle-orm";
import db from "../db";
import { user, member } from "../db/schema";

export const listNonMemberUsers = () =>
  db
    .select(getColumns(user))
    .from(user)
    .leftJoin(member, eq(user.id, member.userId))
    .where(isNull(member.userId))
    .all();

export const listMemberUsers = () =>
  db
    .select(getColumns(user))
    .from(user)
    .innerJoin(member, eq(user.id, member.userId))
    .all();

export const listUsers = () => db.select().from(user).all();
