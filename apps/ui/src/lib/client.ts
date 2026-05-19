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

const client: Client = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client, {
  experimental_defaults: {
    member: {
      create: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({
              queryKey: orpc.user.list.key(),
            });
            context.client.invalidateQueries({
              queryKey: orpc.member.list.key(),
            });
          },
        },
      },
    },

    collection: {
      set: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, ctx) {
            ctx.client.invalidateQueries({
              queryKey: orpc.collection.get.key({
                input: {
                  userId: variables.userId,
                },
              }),
            });
          },
        },
      },
    },

    trade: {
      create: {
        mutationOptions: {
          onSuccess(_data, variables, _onMutateResult, ctx) {
            ctx.client.invalidateQueries({
              queryKey: orpc.trade.list.key(),
            });
          },
        },
      },
      setStatus: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, ctx) {
            ctx.client.invalidateQueries({
              queryKey: orpc.trade.list.key(),
            });
          },
        },
      },
      delete: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, ctx) {
            ctx.client.invalidateQueries({
              queryKey: orpc.trade.list.key(),
            });
          },
        },
      },
    },

    deck: {
      create: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({
              queryKey: orpc.deck.list.key(),
            });
          },
        },
      },
      update: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({
              queryKey: orpc.deck.list.key(),
            });
            context.client.invalidateQueries({
              queryKey: orpc.deck.get.key({
                input: { deckId: variables.deckId },
              }),
            });
          },
        },
      },
      setCards: {
        mutationOptions: {
          onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({
              queryKey: orpc.deck.get.key({
                input: { deckId: variables.deckId },
              }),
            });
          },
        },
      },
      updateCards: {
        mutationOptions: {
          onSuccess(error, variables, onMutateResult, context) {
            context.client.invalidateQueries({
              queryKey: orpc.deck.get.key({
                input: { deckId: variables.deckId },
              }),
            });
          },
        },
      },
    },
  },
});
