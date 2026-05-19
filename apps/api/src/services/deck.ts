import db from "../db";
import * as repo from "../repository/";

export function createDeck({
  userId,
  name,
  commanderCardName,
  partnerCardName = null,
}: {
  userId: string;
  name: string;
  commanderCardName: string;
  partnerCardName?: string | null;
}) {
  db.transaction((tx) => {
    const { id: collectionId } = repo.insertCollection(tx);

    repo.insertDeck(
      { name, userId, commanderCardName, partnerCardName, collectionId },
      tx,
    );
  });
}

export const listDecks = repo.listDecks;

export function getDeck({ deckId }: { deckId: number }) {
  const deck = repo.getDeck({ deckId });
  if (!deck) return null;

  const insufficientCardQuantities = repo.getInsufficientCardQuantities({
    requiredCollectionId: deck.collectionId,
    availableCollectionId: deck.owner.collectionId,
  });

  return { ...deck, insufficientCardQuantities };
}

export const deleteDeck = repo.deleteDeck;
export const updateDeck = repo.updateDeck;
export const getDeckCollectionId = repo.getDeckCollectionId;
