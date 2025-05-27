import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { createServerFn } from "@tanstack/react-start";

export interface ProductSearchParams {
  select?: string;
  q?: string;
  refine?: Array<string>;
  sort?: string;
  currency?: string;
  locale?: string;
  expand?: Array<string>;
  allImages?: boolean;
  perPricebook?: boolean;
  allVariationProperties?: boolean;
  offset?: any;
  limit?: number;
}

export const getProducts = createServerFn({ method: "GET" })
  .validator((data: ProductSearchParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.productSearch({
      parameters: data,
    });
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((data: { productId: string; expand?: string[] }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getProduct({
      parameters: {
        id: data.productId,
        allImages: true,
        expand: data.expand || ["prices", "images", "variations"],
      },
    });
  });
