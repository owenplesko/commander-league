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
export const getDeck = repo.getDeck;
export const deleteDeck = repo.deleteDeck;
export const updateDeck = repo.updateDeck;
export const getDeckCollectionId = repo.getDeckCollectionId;
