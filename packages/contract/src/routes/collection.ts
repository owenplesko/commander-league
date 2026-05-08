import { oc } from "@orpc/contract";
import {
  CardSchema,
  CollectionSchema,
  SetCollectionBodySchema,
  GetMemberSchema,
} from "../schemas";
import z from "zod";

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
