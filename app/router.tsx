import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/not-found";
import { MutationCache, QueryClient, QueryKey } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQuery?: QueryKey;
      sucessMessage?: string;
      errorMessage?: string;
    };
  }
}

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.sucessMessage) {
          toast.success(mutation.meta.sucessMessage);
        }
      },
      onError: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          toast.error(mutation.meta.errorMessage);
        }
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQuery) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidateQuery,
          });
        }
      },
    }),
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      scrollRestoration: true,
      scrollRestorationBehavior: "smooth",
    }),
    queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
