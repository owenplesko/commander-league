import { admin } from "../middleware/member";
import * as service from "../services/";

const setPackOfferings = admin.pack.setOfferings.handler(({ input }) => {
  service.setPackOfferings(input);
});

export const packRoutes = {
  setOfferings: setPackOfferings,
};
