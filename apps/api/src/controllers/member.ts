import { ORPCError } from "@orpc/server";
import { admin, member } from "../orpc";
import * as service from "../services/";

const listMembers = member.member.list.handler(() => {
  const members = service.listMembers();
  return members;
});

const createMember = admin.member.create.handler(({ input }) => {
  service.createMember({ userId: input.userId });
});

const getMember = member.member.get.handler(({ input }) => {
  const member = service.getMember({ userId: input.userId });
  if (!member) throw new ORPCError("NOT_FOUND");
  return member;
});

const updateMember = admin.member.update.handler(({ input }) => {
  throw new ORPCError("NOT_IMPLEMENTED");
});

const deleteMember = admin.member.delete.handler(({ input }) => {
  throw new ORPCError("NOT_IMPLEMENTED");
});

export const memberRoutes = {
  list: listMembers,
  create: createMember,
  get: getMember,
  update: updateMember,
  delete: deleteMember,
};
