import { oc } from "@orpc/contract";
import { GetUserParams, UserSchema } from "../schemas";

const listUsers = oc
  .route({ method: "GET", path: "/user" })
  .input(GetUserParams)
  .output(UserSchema.array());

export const userRoutes = {
  list: listUsers,
};
