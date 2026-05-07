import db from "../db";

export function getCollection({ userId }: { userId: string }) {
  const res = db.query.leagueMember.findFirst({
    columns: {},
    where: {
      userId: input.userId,
    },
    with: {
      collection: { with: { cardQuantities: { with: { card: true } } } },
    },
  });
}
