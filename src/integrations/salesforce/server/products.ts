import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import {
  GetProductParams,
  GetProductsByIdsParams,
} from "@/integrations/salesforce/types/params";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const productSearchParamsSchema = z.object({
  select: z.string().optional(),
  q: z.string().optional(),
  refine: z.array(z.string()).optional(),
  sort: z.string().optional(),
  currency: z.string().optional(),
  locale: z.string().optional(),
  expand: z.array(z.string()).optional(),
  allImages: z.boolean().optional(),
  perPricebook: z.boolean().optional(),
  allVariationProperties: z.boolean().optional(),
  offset: z.any().optional(),
  limit: z.number().optional(),
});

export type ProductSearchParams = z.infer<typeof productSearchParamsSchema>;

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
