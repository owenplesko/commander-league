import "dotenv/config";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { router } from "./routes";
import { drizzle } from "drizzle-orm/bun-sqlite";

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [onError((error) => console.log(error))],
});

const db = drizzle(process.env.DB_FILE_NAME!);

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/rpc",
      context: { db },
    });

    if (matched) {
      return response;
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
