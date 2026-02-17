import { oc } from "@orpc/contract";
import {
  CollectionSchema,
  GetCollectionSchema,
  SetCollectionSchema,
} from "../schemas/collection";

const getCollection = oc
  .route({
    method: "GET",
    path: "/league/{leagueId}/collection/{userId}",
  })
  .input(GetCollectionSchema)
  .output(CollectionSchema);

const setCollection = oc
  .route({
    method: "PUT",
    path: "/league/{leagueId}/collection/{userId}",
    successStatus: 204,
  })
  .input(SetCollectionSchema);

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
