import { oc } from "@orpc/contract";
import {
  GetMemberSchema,
  CreateDeckBodySchema,
  DeckListEntrySchema,
  DeckSchema,
  GetDeckSchema,
  SetDeckCardsBodySchema,
  UpdateDeckBodySchema,
  UpdateDeckCardsBodySchema,
} from "../schemas";
import { cardResolutionError } from "../errors/card";

const listDecks = oc
  .route({ method: "GET", path: "/deck" })
  .input(GetMemberSchema)
  .output(DeckListEntrySchema.array());

const createDeck = oc
  .route({
    method: "POST",
    path: "/deck",
    successStatus: 201,
  })
  .input(CreateDeckBodySchema);

const getDeck = oc
  .route({ method: "GET", path: "/deck/{deckId}" })
  .input(GetDeckSchema)
  .output(DeckSchema);

const updateDeck = oc
  .route({ method: "PATCH", path: "/deck/{deckId}", successStatus: 204 })
  .input(GetDeckSchema.extend(UpdateDeckBodySchema.shape));

const setDeckCards = oc
  .route({ method: "PUT", path: "/deck/{deckId}/card", successStatus: 204 })
  .input(GetDeckSchema.extend(SetDeckCardsBodySchema.shape))
  .errors(cardResolutionError);

const updateDeckCards = oc
  .route({ method: "PATCH", path: "/deck/{deckId}/card", successStatus: 204 })
  .input(GetDeckSchema.extend(UpdateDeckCardsBodySchema.shape));

const deleteDeck = oc
  .route({
    method: "DELETE",
    path: "/deck/{deckId}",
    successStatus: 204,
  })
  .input(GetDeckSchema);

export const deckRoutes = {
  list: listDecks,
  get: getDeck,
  create: createDeck,
  update: updateDeck,
  updateCards: updateDeckCards,
  setCards: setDeckCards,
  delete: deleteDeck,
};
