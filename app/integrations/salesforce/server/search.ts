import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { createServerFn } from "@tanstack/react-start";

export const searchProducts = createServerFn({ method: "GET" })
  .validator(
    (data: { q: string; refine?: string[]; limit?: number; offset?: number }) =>
      data
  )
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.productSearch({
      parameters: {
        q: data.q,
        refine: data.refine,
        limit: data.limit || 20,
        offset: data.offset || 0,
      },
    });
  });

export const getCategories = createServerFn({ method: "GET" })
  .validator((data: { levels?: number } = {}) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getCategories({
      parameters: {
        levels: data.levels || 1,
      },
    });
  });
