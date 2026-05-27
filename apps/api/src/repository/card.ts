import { inArray, sql } from "drizzle-orm";
import db from "../db";
import { card } from "../db/schema";

export function globalCardSearch({
  searchTerm,
  limit,
}: {
  searchTerm: string;
  limit: number;
}) {
  const res = db.query.card
    .findMany({
      where: {
        name: {
          like: `%${searchTerm}%`,
        },
      },
      limit,
    })
    .sync();

  return res;
}

export function collectionCardSearch({
  searchTerm,
  collectionId,
  limit,
}: {
  searchTerm: string;
  collectionId: number;
  limit: number;
}) {
  const res = db.query.collectionCard
    .findMany({
      columns: {},
      where: {
        collectionId,
        cardName: {
          like: `%${searchTerm}%`,
        },
      },
      limit,
      with: {
        card: true,
      },
    })
    .sync()
    .map(({ card }) => card);

  return res;
}

export function resolveCardNames({ cardNames }: { cardNames: string[] }) {
  if (cardNames.length === 0) return [];

  const inputCardNames = db.$with("input_card_names").as(
    sql`SELECT * FROM (VALUES ${sql.join(
      cardNames.map((name) => sql`(${name})`),
      sql`, `,
    )}) AS t(input)`,
  );

  const res = db.select();
}

export function filterValidCardNames({ cardNames }: { cardNames: string[] }) {
  if (cardNames.length === 0) return [];

  const validCards = db
    .select({ name: card.name })
    .from(card)
    .where(inArray(card.name, cardNames))
    .all();

  return validCards;
}
