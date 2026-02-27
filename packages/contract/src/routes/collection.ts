import { oc } from "@orpc/contract";
import {
  CollectionSchema,
  CreateCollectionSchema,
} from "../schemas/collection";
import { GetLeagueMemberSchema } from "../schemas";

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
  .input(GetLeagueMemberSchema.extend(CreateCollectionSchema.shape));

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
