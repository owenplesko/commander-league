import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider, type PrimeReactPTOptions } from "primereact/api";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "primereact/resources/themes/soho-dark/theme.css";
import "primeicons/primeicons.css";
import "./index.css";

import { routeTree } from "./routeTree.gen.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/client.ts";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const pt: PrimeReactPTOptions = {
  dataview: { content: { style: { "background-color": "transparent" } } },
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <PrimeReactProvider value={{ pt }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </PrimeReactProvider>
    </StrictMode>,
  );
}
