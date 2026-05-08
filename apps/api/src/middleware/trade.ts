import { ORPCError } from "@orpc/server";
import { base } from "../orpc";
import * as service from "../services/";

export const tradeParticipantMiddleware = base
  .$context<{ userId: string }>()
  .middleware(
    ({ context: { userId }, next }, { tradeId }: { tradeId: number }) => {
      const res = service.getTradeRole({ tradeId, userId });
      if (!res.success) {
        switch (res.error) {
          case "not_found":
            throw new ORPCError("NOT_FOUND");
        }
      }

      if (res.tradeRole === null) throw new ORPCError("UNAUTHORIZED");

      return next({ context: { tradeRole: res.tradeRole } });
    },
  );
