import { oc } from "@orpc/contract";
import {
  MemberSchema,
  GetMemberSchema,
  CreateMemberSchema,
  IncrementPackPointSchema,
} from "../schemas";

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

const getMe = oc
  .route({ method: "GET", path: "/member/@me" })
  .output(MemberSchema);

const deleteMember = oc
  .route({ method: "DELETE", path: "/member/{userId}", successStatus: 204 })
  .input(GetMemberSchema);

const incrementMemberPackPoints = oc
  .route({
    method: "POST",
    path: "/member/packPoint",
  })
  .input(IncrementPackPointSchema);

export const memberRoutes = {
  list: listMembers,
  create: createMember,
  me: getMe,
  get: getMember,
  delete: deleteMember,
  incrementPackPoints: incrementMemberPackPoints,
};
