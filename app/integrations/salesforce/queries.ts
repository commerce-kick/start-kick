import { SalesforceClientProxy } from "@/integrations/salesforce/proxy";
import { queryOptions } from "@tanstack/react-query";

export const salesforceQueries = {
  products: (client: SalesforceClientProxy) => ({
    list: (
      params: { refine?: string[]; limit?: number; offset?: number } = {}
    ) =>
      queryOptions({
        ...client.products().list(params),
        staleTime: 5 * 60 * 1000,
      }),

    detail: (productId: string, params: { expand?: string[] } = {}) =>
      queryOptions({
        ...client.products().detail(productId, params),
        staleTime: 10 * 60 * 1000,
      }),

    search: (
      query: string,
      params: { refine?: string[]; limit?: number; offset?: number } = {}
    ) =>
      queryOptions({
        ...client.products().search(query, params),
        staleTime: 2 * 60 * 1000,
      }),
  }),

  auth: (client: SalesforceClientProxy) => ({
    status: () =>
      queryOptions({
        queryKey: ["salesforce", "auth", "status"],
        queryFn: () => client.auth().status(),
        staleTime: 30 * 1000,
      }),
  }),
};
