import { oc } from "@orpc/contract";
import { GetLeagueMemberSchema, GetLeagueSchema } from "../schemas";
import {
  CreateDeckBodySchema,
  DeckListEntrySchema,
  DeckSchema,
  GetDeckSchema,
  SetDeckCardsBodySchema,
  UpdateDeckBodySchema,
  UpdateDeckCardsBodySchema,
} from "../schemas/deck";

const listDecks = oc
  .route({ method: "GET", path: "/league/{leagueId}/users/{userId}/deck" })
  .input(GetLeagueMemberSchema)
  .output(DeckListEntrySchema.array());

const createDeck = oc
  .route({
    method: "POST",
    path: "/deck",
    successStatus: 201,
  })
  .input(GetLeagueSchema.extend(CreateDeckBodySchema.shape))
  .output(DeckSchema);

const getDeck = oc
  .route({ method: "GET", path: "/deck/{deckId}" })
  .input(GetDeckSchema)
  .output(DeckSchema);

const updateDeck = oc
  .route({ method: "PATCH", path: "/deck/{deckId}" })
  .input(GetDeckSchema.extend(UpdateDeckBodySchema.shape));

const setDeckCards = oc
  .route({ method: "PUT", path: "/deck/{deckId}/cards" })
  .input(GetDeckSchema.extend(SetDeckCardsBodySchema.shape));

const updateDeckCards = oc
  .route({ method: "PATCH", path: "/deck/{deckId}/cards" })
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
