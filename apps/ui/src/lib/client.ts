import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@commander-league/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const link = new OpenAPILink(contract, {
  url: "http://localhost:5173/api",
});

type Client = JsonifiedClient<ContractRouterClient<typeof contract>>;

export const client: Client = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client, {
  experimental_defaults: {
    league: {
      create: {
        mutationOptions: {
          onSuccess: (_output, _input, _err, ctx) => {
            ctx.client.invalidateQueries({ queryKey: orpc.league.list.key() });
          },
        },
      },
      join: {
        mutationOptions: {
          onSuccess: (_output, _input, _err, ctx) => {
            ctx.client.invalidateQueries({ queryKey: orpc.league.list.key() });
          },
        },
      },
      inviteCode: {
        create: {
          mutationOptions: {
            onSuccess: (_output, input, _err, ctx) => {
              ctx.client.invalidateQueries({
                queryKey: orpc.league.inviteCode.list.key({ input }),
              });
            },
          },
        },
        update: {
          mutationOptions: {
            onSuccess: (_output, input, _err, ctx) => {
              ctx.client.invalidateQueries({
                queryKey: orpc.league.inviteCode.list.key({
                  input: { leagueId: input.leagueId },
                }),
              });
            },
          },
        },
        delete: {
          mutationOptions: {
            onSuccess: (_output, { leagueId }, _err, ctx) => {
              ctx.client.invalidateQueries({
                queryKey: orpc.league.inviteCode.list.key({
                  input: { leagueId },
                }),
              });
            },
          },
        },
      },
    },
  },
});
