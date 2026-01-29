import { ORPCError, os } from "@orpc/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:5173"],
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  socialProviders: {
    discord: {
      enabled: true,
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
});

export const authMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ context, next }) => {
    const user = await auth.api.getSession({ headers: context.headers });
    const userId = user?.user.id;

    if (!userId) throw new ORPCError("UNAUTHORIZED");

    return await next({
      context: {
        userId: userId,
      },
    });
  });
