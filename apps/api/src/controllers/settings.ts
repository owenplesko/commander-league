import { ORPCError } from "@orpc/server";
import { admin } from "../orpc";

const getSettings = admin.settings.get.handler(() => {
  throw new ORPCError("NOT_IMPLEMENTED");
});

const updateSettings = admin.settings.update.handler(() => {
  throw new ORPCError("NOT_IMPLEMENTED");
});

export const settingsRoutes = {
  get: getSettings,
  update: updateSettings,
};
