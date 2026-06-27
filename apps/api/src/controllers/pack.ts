import { admin, member } from "../middleware/member";
import * as service from "../services/";

const listPacks = admin.pack.list.handler(() => {
  return service.listPacks();
});

const setPackOfferings = admin.pack.setOfferings.handler(
  ({ input, errors }) => {
    const invalidPackIds = service.filterInvalidPackIds({
      packIds: input.map(({ packId }) => packId),
    });

    if (invalidPackIds.length > 0)
      throw errors.BAD_REQUEST({ data: { unknown: invalidPackIds } });

    service.setPackOfferings(input);
  },
);

const listPackOfferings = member.pack.listOfferings.handler(() => {
  return service.listPackOfferings();
});

const openPackOffering = member.pack.openOffering.handler(({ input }) => {
  const packCards = service.openPack({ packId: input.packId });
  return packCards;
});

export const packRoutes = {
  list: listPacks,
  setOfferings: setPackOfferings,
  listOfferings: listPackOfferings,
  openOffering: openPackOffering,
};
