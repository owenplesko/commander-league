import { oc } from "@orpc/contract";
import { GetLeagueMemberSchema, GetLeagueSchema } from "../schemas";
import {
  DeckListEntrySchema,
  DeckSchema,
  GetDeckSchema,
} from "../schemas/deck";

const listDecks = oc
  .route({ method: "GET", path: "/league/{leagueId}/users/{userId}/deck" })
  .input(GetLeagueMemberSchema)
  .output(DeckListEntrySchema.array());

const createDeck = oc
  .route({
    method: "POST",
    path: "/league/{leagueId}/deck",
    successStatus: 201,
  })
  .input(GetLeagueSchema)
  .output(DeckSchema);

const getDeck = oc
  .route({ method: "GET", path: "/league/{leagueId}/deck/{deckId}" })
  .input(GetDeckSchema)
  .output(DeckSchema);

const updateDeck = oc
  .route({ method: "PUT", path: "/league/{leagueId}/deck/{deckId}" })
  .input(GetDeckSchema)
  .output(DeckSchema);

const deleteDeck = oc
  .route({
    method: "DELETE",
    path: "/league/{leagueId}/deck/{deckId}",
    successStatus: 204,
  })
  .input(GetDeckSchema);

export const deckRoutes = {
  list: listDecks,
  get: getDeck,
  create: createDeck,
  update: updateDeck,
  delete: deleteDeck,
};
