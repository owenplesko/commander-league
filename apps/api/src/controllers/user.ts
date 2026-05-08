import { admin } from "../orpc";
import * as service from "../services/";

const listUsers = admin.user.list.handler(({ input: { isMember } }) => {
  const users = service.listUsers({ isMember });
  return users;
});

export const userRoutes = {
  list: listUsers,
};
