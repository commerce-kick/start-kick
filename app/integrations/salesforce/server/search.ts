import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { createServerFn } from "@tanstack/react-start";

export const searchProducts = createServerFn({ method: "GET" })
  .validator(
    (data: { q: string; refine?: string[]; limit?: number; offset?: number }) =>
      data,
  )
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
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

export const getCategory = createServerFn({ method: "GET" })
  .validator((data: { id: string; levels?: number }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getCategory({
      parameters: {
        id: data.id,
        levels: data.levels || 2,
      },
    });
  });
