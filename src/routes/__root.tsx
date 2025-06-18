import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import AIAssistant from "@/components/chat";
import { Footer } from "@/components/commerce/footer";
import { HeaderWithFallback } from "@/components/commerce/header-with-fallback";
import { Toaster } from "@/components/ui/sonner";
import { getCustomerQueryOptions } from "@/integrations/salesforce/options/customer";
import { getCategoryQueryOptions } from "@/integrations/salesforce/options/products";
//@ts-ignore
import appCss from '@/styles/app.css?url';

import { QueryClient, useSuspenseQueries } from "@tanstack/react-query";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
      getCategoryQueryOptions({ id: "root", levels: 2 }),
    );

    queryClient.ensureQueryData(getCustomerQueryOptions());
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
  const [{ data }, { data: user }] = useSuspenseQueries({
    queries: [
      getCategoryQueryOptions({ id: "root", levels: 2 }),
      getCustomerQueryOptions(),
    ],
  });

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <HeaderWithFallback categories={data.categories} user={user} />

        <div className="flex min-h-screen flex-col">{children}</div>

        <Footer />

        <AIAssistant />

        <Analytics />
        <SpeedInsights />
        
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
