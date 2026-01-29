import { onError } from "@orpc/server";
import { router } from "./routes";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { auth } from "./auth";
import { Hono } from "hono";

const db = drizzle(process.env.DB_FILE_NAME!);

const handler = new OpenAPIHandler(router, {
  interceptors: [onError((error) => console.log(error))],
});

const app = new Hono();

app.use("/api/auth/*", async (c, next) => {
  return await auth.handler(c.req.raw);
});

app.use("/api/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/api",
    context: { env: { db } },
  });
  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Server running at ${server.url}`);
