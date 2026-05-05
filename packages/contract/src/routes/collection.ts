import { oc } from "@orpc/contract";
import {
  CollectionSchema,
  CreateCollectionBodySchema,
} from "../schemas/collection";
import { CardSchema, GetLeagueMemberSchema } from "../schemas";
import z from "zod";

const getCollection = oc
  .route({
    method: "GET",
    path: "/league/{leagueId}/member/{userId}/collection",
  })
  .input(GetLeagueMemberSchema)
  .output(CollectionSchema);

const setCollection = oc
  .route({
    method: "PUT",
    path: "/league/{leagueId}/member/{userId}/collection",
    successStatus: 204,
  })
  .input(GetLeagueMemberSchema.extend(CreateCollectionBodySchema.shape))
  .errors({
    BAD_REQUEST: {
      data: z.object({
        invalidCardNames: CardSchema.shape.name.array(),
      }),
    },
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
