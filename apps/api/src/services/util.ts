import type { TX } from "../db";
import db from "../db";

type NotPromise<T> = T extends Promise<any> ? never : T;

export function withTransaction<T>(
  tx: TX | undefined,
  fn: (tx: TX) => NotPromise<T>,
) {
  if (tx) {
    return fn(tx);
  }

  return db.transaction((tx) => fn(tx));
}
