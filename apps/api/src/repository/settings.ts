import db, { type TX } from "../db";
import { settings } from "../db/schema";

export const getPublicSettings = () =>
  db.query.settings
    .findFirst({ columns: { name: true, ownerId: true } })
    .sync();

export const insertSettings = (
  {
    name,
    ownerId,
  }: {
    name: string;
    ownerId: string;
  },
  tx: TX,
) => tx.insert(settings).values({ name, ownerId }).run();
