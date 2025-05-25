import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { createServerFn } from "@tanstack/react-start";

export const getProducts = createServerFn({ method: "GET" })
  .validator(
    (data: { refine?: string[]; limit?: number; offset?: number }) => data
  )
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.productSearch({
      parameters: {
        refine: data.refine || ["cgid=root"],
        limit: data.limit || 10,
        offset: data.offset || 0,
      },
    });
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((data: { productId: string; expand?: string[] }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getProduct({
      parameters: {
        id: data.productId,
        allImages: true,
        expand: data.expand || ["prices", "images", "variations"],
      },
    });
  });
