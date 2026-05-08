import { ORPCError } from "@orpc/server";
import * as service from "../services";
import { admin, member } from "../middleware/member";

const getCollection = member.collection.get.handler(({ input: { userId } }) => {
  const member = service.getMember({ userId });

  if (!member) throw new ORPCError("NOT_FOUND");

  const collection = service.getCollection({
    collectionId: member.collectionId,
  });

  if (!collection) throw new ORPCError("NOT_FOUND");

  return collection;
});

const setCollection = admin.collection.set.handler(
  ({ input: { userId, cardQuantities }, errors }) => {
    const member = service.getMember({ userId });
    if (!member) throw new ORPCError("NOT_FOUND");

    const invalidCardNames = service.filterInvalidCardNames({
      cardNames: cardQuantities.map(({ cardName }) => cardName),
    });
    if (invalidCardNames.length > 0)
      throw errors.BAD_REQUEST({ data: { invalidCardNames } });

    service.setCollectionCards({
      collectionId: member.collectionId,
      cardQuantities,
    });
  },
);

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
