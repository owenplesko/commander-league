import { oc } from "@orpc/contract";
import { MemberSchema, GetMemberSchema, CreateMemberSchema } from "../schemas";

const listMembers = oc
  .route({ method: "GET", path: "/member" })
  .output(MemberSchema.array());

const createMember = oc
  .route({ method: "POST", path: "/member", successStatus: 201 })
  .input(CreateMemberSchema);

const getMember = oc
  .route({ method: "GET", path: "/member/{userId}" })
  .input(GetMemberSchema)
  .output(MemberSchema);

const updateMember = oc
  .route({ method: "PATCH", path: "/member/{userId}", successStatus: 204 })
  .input(GetMemberSchema);

const deleteMember = oc
  .route({ method: "DELETE", path: "/member/{userId}", successStatus: 204 })
  .input(GetMemberSchema);

export const memberRoutes = {
  list: listMembers,
  create: createMember,
  get: getMember,
  update: updateMember,
  delete: deleteMember,
};
