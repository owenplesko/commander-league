import { ORPCError } from "@orpc/server";
import { authMiddleware } from "./auth";
import { getMember } from "../repository/member";
import { base } from "../orpc";

export const memberMiddleware = authMiddleware.concat(
  ({ context: { userId }, next }) => {
    const member = getMember({ userId });

    if (!member) throw new ORPCError("UNAUTHORIZED");

    return next({ context: { admin: member.admin } });
  },
);

export const adminMiddleware = memberMiddleware.concat(
  ({ context: { admin }, next }) => {
    if (!admin) throw new ORPCError("UNAUTHORIZED");

    return next();
  },
);

export const member = base.use(memberMiddleware);
export const admin = base.use(adminMiddleware);
