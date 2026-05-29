import { ORPCError } from "@orpc/server";
import * as service from "../services";
import { member, selfOrAdminMiddleware } from "../middleware/member";

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
  .handler(({ input: { userId, cardQuantities }, errors }) => {
    const member = service.getMember({ userId });
    if (!member) throw new ORPCError("NOT_FOUND");

    const { unknown, ambiguous, resolutions } =
      service.resolveCardQuantityAliases({ cardQuantities });
    if (unknown || ambiguous)
      throw errors.BAD_REQUEST({ data: { unknown, ambiguous } });

    service.setCollectionCards({
      collectionId: member.collectionId,
      cardQuantities: resolutions,
    });
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
