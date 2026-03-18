import { oc } from "@orpc/contract";
import { GetLeagueMemberSchema } from "../schemas";
import { DeckListEntrySchema } from "../schemas/deck";

const listDecks = oc
  .route({ method: "GET", path: "/league/{leagueId}/users/{userId}/deck" })
  .input(GetLeagueMemberSchema)
  .output(DeckListEntrySchema.array());

export const deckRoutes = { list: listDecks };
