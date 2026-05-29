import { oc } from "@orpc/contract";
import {
  CollectionSchema,
  SetCollectionBodySchema,
  GetMemberSchema,
} from "../schemas";
import { cardResolutionError } from "../errors/card";

const getCollection = oc
  .route({
    method: "GET",
    path: "/member/{userId}/collection",
  })
  .input(GetMemberSchema)
  .output(CollectionSchema);

const setCollection = oc
  .route({
    method: "PUT",
    path: "/member/{userId}/collection",
    successStatus: 204,
  })
  .input(GetMemberSchema.extend(SetCollectionBodySchema.shape))
  .errors(cardResolutionError);

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
