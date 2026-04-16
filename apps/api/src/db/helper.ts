import type { DB, TX } from ".";

function isTransaction(dbOrTx: DB | TX): dbOrTx is TX {
  return !("transaction" in dbOrTx);
}

export function withTransaction<T>(
  dbOrTx: DB | TX,
  fn: (tx: TX) => T extends Promise<any> ? never : T,
): T {
  if (isTransaction(dbOrTx)) {
    return fn(dbOrTx);
  }
  return dbOrTx.transaction(fn);
}
