import { ORPCError } from "@orpc/server";
import * as service from "../services";
import { member, selfOrAdminMiddleware } from "../middleware/member";
import { invalidCardsMiddleware } from "../middleware/cards";

const getCollection = member.collection.get.handler(({ input: { userId } }) => {
  const member = service.getMember({ userId });

  if (!member) throw new ORPCError("NOT_FOUND");

  const collection = service.getCollection({
    collectionId: member.collectionId,
  });

  if (!collection) throw new ORPCError("NOT_FOUND");

  return collection;
});

const setCollection = member.collection.set
  .use(selfOrAdminMiddleware)
  .use(invalidCardsMiddleware)
  .handler(({ input: { userId, cardQuantities } }) => {
    const member = service.getMember({ userId });
    if (!member) throw new ORPCError("NOT_FOUND");

    service.setCollectionCards({
      collectionId: member.collectionId,
      cardQuantities,
    });
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
