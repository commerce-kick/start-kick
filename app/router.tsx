// app/router.tsx

import { SalesforceClientProxy } from "@/integrations/salesforce/proxy";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const queryClient = new QueryClient({});
  const salesforceClient = new SalesforceClientProxy();

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        queryClient,
        salesforceClient: salesforceClient,
      },
      defaultPreload: "intent",
      defaultPendingComponent: () => <div>Loading...</div>,
      defaultNotFoundComponent: () => <div>Page not found</div>,
    }),
    queryClient
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
