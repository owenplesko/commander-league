import { admin, member } from "../middleware/member";
import * as service from "../services/";

const listPacks = admin.pack.list.handler(() => {
  return service.listPacks();
});

const setPackOfferings = admin.pack.setOfferings.handler(({ input }) => {
  service.setPackOfferings(input);
});

const listPackOfferings = member.pack.listOfferings.handler(() => {
  return service.listPackOfferings();
});

export const packRoutes = {
  list: listPacks,
  setOfferings: setPackOfferings,
  listOfferings: listPackOfferings,
};
