import { oc } from "@orpc/contract";
import { SettingsSchema, UpdateSettingsSchema } from "../schemas";

const getSettings = oc
  .route({ path: "/settings", method: "GET" })
  .output(SettingsSchema);

const updateSettings = oc
  .route({
    path: "/admin/settings",
    method: "PATCH",
  })
  .input(UpdateSettingsSchema);

export const settingsRoutes = {
  get: getSettings,
  update: updateSettings,
};
