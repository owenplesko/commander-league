import { ORPCError } from "@orpc/server";
import { admin, member } from "../middleware/member";
import * as service from "../services/";
import { authed } from "../middleware/auth";

const listMembers = member.member.list.handler(() => {
  const members = service.listMembers();
  return members;
});

const createMember = admin.member.create.handler(({ input }) => {
  service.createMember({ userId: input.userId });
});

const getMe = authed.member.me.handler(({ context }) => {
  const member = service.getMember({ userId: context.userId });
  if (!member) throw new ORPCError("NOT_FOUND");
  return member;
});

const getMember = member.member.get.handler(({ input }) => {
  const member = service.getMember({ userId: input.userId });
  if (!member) throw new ORPCError("NOT_FOUND");
  return member;
});

const incrementMemberPackPoints = admin.member.incrementPackPoints.handler(
  ({ input }) => {
    if (input.userIds) {
      service.incrementMemberPackPoints({
        userIds: input.userIds,
        increment: input.increment,
      });
    } else {
      service.incrementAllMemberPackPoints({
        increment: input.increment,
      });
    }
  },
);

const deleteMember = admin.member.delete.handler(({ input }) => {
  throw new ORPCError("NOT_IMPLEMENTED");
});

export const memberRoutes = {
  list: listMembers,
  create: createMember,
  me: getMe,
  get: getMember,
  incrementPackPoints: incrementMemberPackPoints,
  delete: deleteMember,
};
