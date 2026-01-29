import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./index.css";

import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <PrimeReactProvider>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </StrictMode>,
  );
}
