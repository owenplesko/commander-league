import { oc } from "@orpc/contract";
import { GetLeagueMemberSchema, GetLeagueSchema } from "../schemas";
import {
  CreateDeckBodySchema,
  DeckListEntrySchema,
  DeckSchema,
  GetDeckSchema,
  UpdateDeckBodySchema,
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
  .route({ method: "PUT", path: "/deck/{deckId}" })
  .input(GetDeckSchema.extend(UpdateDeckBodySchema.shape))
  .output(DeckSchema);

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
  delete: deleteDeck,
};
