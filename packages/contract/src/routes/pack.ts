import { oc } from "@orpc/contract";
import {
  CreatePackOfferingSchema,
  GetPackSchema,
  PackOfferingSchema,
  PackOpeningSchema,
  PackSchema,
} from "../schemas/pack";
import { packResolutionError } from "../errors/pack";
import { CardQuantitySchema } from "../schemas";

const listPacks = oc
  .route({
    method: "GET",
    path: "/pack",
  })
  .output(PackSchema.array());

const setPack = oc.route({
  method: "PUT",
  path: "/pack",
  successStatus: 201,
});

const deletePack = oc
  .route({
    method: "DELETE",
    path: "/pack/{packId}",
    successStatus: 204,
  })
  .input(GetPackSchema);

const listPackOfferings = oc
  .route({
    method: "GET",
    path: "/pack/offering",
  })
  .output(PackOfferingSchema.array());

const setPackOfferings = oc
  .route({
    method: "PUT",
    path: "/pack/offering",
    successStatus: 201,
  })
  .input(CreatePackOfferingSchema.array())
  .errors(packResolutionError);

const openPackOffering = oc
  .route({
    method: "GET",
    path: "/pack/{packId}/open",
  })
  .input(GetPackSchema)
  .output(PackOpeningSchema);

export const packRoutes = {
  list: listPacks,
  setOfferings: setPackOfferings,
  listOfferings: listPackOfferings,
  openOffering: openPackOffering,
};
