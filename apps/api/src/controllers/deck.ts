import { member } from "../orpc";
import { ORPCError } from "@orpc/server";
import * as service from "../services/";

const listDecksController = member.deck.list.handler(({ input }) => {
  const decks = service.listDecks({ ownerId: input.userId });
  return decks;
});

const getDeckController = member.deck.get.handler(({ input }) => {
  const deck = service.getDeck({ deckId: input.deckId });
  if (!deck) throw new ORPCError("NOT_FOUND");
  return deck;
});

const createDeckController = member.deck.create.handler(
  ({ input, context }) => {
    service.createDeck({
      userId: context.userId,
      name: input.name,
      commanderCardName: input.commanderCardName,
      partnerCardName: input.partnerCardName,
    });
  },
);

const updateDeckController = member.deck.update.handler(({ input }) => {
  service.updateDeck({
    deckId: input.deckId,
    name: input.name,
    commanderCardName: input.commanderCardName,
    partnerCardName: input.partnerCardName,
  });
});

const setDeckCardsController = member.deck.setCards.handler(({ input }) => {
  const res = service.getDeckCollectionId({
    deckId: input.deckId,
  });

  if (!res) throw new ORPCError("NOT_FOUND");

  service.setCollectionCards({
    collectionId: res.collectionId,
    cardQuantities: input.cardQuantities,
  });
});

const updateDeckCardsController = member.deck.updateCards.handler(
  ({ input }) => {
    const res = service.getDeckCollectionId({
      deckId: input.deckId,
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    service.applyCollectionDeltas({
      collectionId: res.collectionId,
      cardDeltas: input.cardDeltas,
    });
  },
);

const deleteDeckController = member.deck.delete.handler(({ input }) => {
  service.deleteDeck({ deckId: input.deckId });
});

export const deckRoutes = {
  list: listDecksController,
  get: getDeckController,
  create: createDeckController,
  update: updateDeckController,
  delete: deleteDeckController,
  setCards: setDeckCardsController,
  updateCards: updateDeckCardsController,
};
