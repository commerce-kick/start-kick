import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import {
  GetProductParams,
  GetProductsByIdsParams,
  ProductSearchParams,
} from "@/integrations/salesforce/types";
import { createServerFn } from "@tanstack/react-start";

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
  .validator((data: GetProductParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getProduct({
      parameters: {
        id: data.id,
        allImages: true,
        expand: data.expand || [
          "availability",
          "promotions",
          "options",
          "images",
          "prices",
          "variations",
          "set_products",
          "bundled_products",
        ],
      },
    });
  });

export const getProductsByIds = createServerFn({ method: "GET" })
  .validator((data: GetProductsByIdsParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getProducts({
      parameters: {
        ids: data.ids,
        allImages: true,
        expand: data.expand || [
          "availability",
          "promotions",
          "options",
          "images",
          "prices",
          "variations",
        ],
      },
    });
  });
