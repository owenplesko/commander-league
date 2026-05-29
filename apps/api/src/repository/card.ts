import { eq, inArray, sql } from "drizzle-orm";
import db from "../db";
import { card, cardAlias } from "../db/schema";

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

  const inputCardNames = db
    .$with("input_card_names", { input: sql<string>`input`.as("input") })
    .as(
      sql.join(
        cardNames.map((name) => sql`SELECT ${name} AS input`),
        sql` UNION ALL `,
      ),
    );

  const res = db
    .with(inputCardNames)
    .select({
      input: inputCardNames.input,
      cardName: card.name,
      aliasedCardName: cardAlias.cardName,
    })
    .from(inputCardNames)
    .leftJoin(card, eq(card.name, inputCardNames.input))
    .leftJoin(cardAlias, eq(cardAlias.alias, inputCardNames.input))
    .all();

  return res;
}
