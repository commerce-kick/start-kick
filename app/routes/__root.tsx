import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Footer } from "@/components/commerce/footer";
import { Header } from "@/components/commerce/header";
import { getCategoryQueryOptions } from "@/integrations/salesforce/options/search";
import appCss from "@/styles/app.css?url";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  loader: async ({ context }) => {
    const { queryClient } = context;

    queryClient.ensureQueryData(
      getCategoryQueryOptions({ id: "root", levels: 2 })
    );
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { data } = useSuspenseQuery(
    getCategoryQueryOptions({ id: "root", levels: 2 })
  );

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {data.categories && <Header categories={data.categories} />}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow"> {children}</main>
        </div>

        <Footer />
        
        <Scripts />
      </body>
    </html>
  );
}
