import { eq } from "drizzle-orm";
import db, { type TX } from "../db";
import { deck } from "../db/schema";

export const listDecks = ({ ownerId }: { ownerId?: string }) =>
  db.query.deck
    .findMany({
      where: { userId: ownerId },
      with: {
        commanderCard: true,
        owner: true,
      },
    })
    .sync();

export const getDeck = ({ deckId }: { deckId: number }) =>
  db.query.deck
    .findFirst({
      where: { id: deckId },
      with: {
        owner: true,
        commanderCard: true,
        partnerCard: true,
        cardQuantities: { with: { card: true } },
      },
    })
    .sync();

export const insertDeck = (
  values: {
    name: string;
    userId: string;
    collectionId: number;
    commanderCardName: string;
    partnerCardName: string | null;
  },
  tx: TX,
) => tx.insert(deck).values(values).returning({ deckId: deck.id }).get();

export const updateDeck = ({
  deckId,
  ...values
}: {
  deckId: number;
  name?: string;
  commanderCardName?: string;
  partnerCardName?: string | null;
}) => db.update(deck).set(values).where(eq(deck.id, deckId)).run();

export const deleteDeck = ({ deckId }: { deckId: number }) =>
  db.delete(deck).where(eq(deck.id, deckId)).run();

export const getDeckCollectionId = ({ deckId }: { deckId: number }) =>
  db
    .select({ collectionId: deck.collectionId })
    .from(deck)
    .where(eq(deck.id, deckId))
    .get();
