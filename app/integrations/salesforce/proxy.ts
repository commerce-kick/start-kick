import * as serverFns from "@/integrations/salesforce/server";

export class SalesforceClientProxy {
  products() {
    return {
      list: (params: { refine?: string[]; limit?: number; offset?: number } = {}) => ({
        queryKey: ["salesforce", "products", "list", params],
        queryFn: () => serverFns.getProducts({ data: params }),
      }),

      detail: (productId: string, params: { expand?: string[] } = {}) => ({
        queryKey: ["salesforce", "products", "detail", productId, params],
        queryFn: () => serverFns.getProduct({ data: { productId, ...params } }),
      }),

      search: (query: string, params: { refine?: string[]; limit?: number; offset?: number } = {}) => ({
        queryKey: ["salesforce", "products", "search", query, params],
        queryFn: () => serverFns.searchProducts({ data: { q: query, ...params } }),
      }),
    }
  }

  auth() {
    return {
      login: (username: string, password: string) => serverFns.authenticateCustomer({ data: { username, password } }),
      logout: () => serverFns.logoutCustomer(),
      status: () => serverFns.getAuthStatus(),
    }
  }
}
