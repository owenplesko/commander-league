import db from "../db";

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
