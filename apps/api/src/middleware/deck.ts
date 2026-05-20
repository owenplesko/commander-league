import { memberMiddleware } from "./member";
import * as service from "../services/";
import { ORPCError } from "@orpc/server";

export const deckOwnerMiddleware = memberMiddleware.concat(
  ({ context, next }, input: { deckId: number }) => {
    const deck = service.getDeckMetadata({ deckId: input.deckId });
    if (!deck) throw new ORPCError("NOT_FOUND");

    if (deck.userId !== context.userId) throw new ORPCError("UNAUTHORIZED");

    return next();
  },
);
