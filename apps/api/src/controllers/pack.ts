import { admin, member } from "../middleware/member";
import * as service from "../services/";

const listPacks = member.pack.list.handler(() => {
  return service.listPacks();
});

const setPackOfferings = admin.pack.setOfferings.handler(({ input }) => {
  service.setPackOfferings(input);
});

export const packRoutes = {
  list: listPacks,
  setOfferings: setPackOfferings,
};
