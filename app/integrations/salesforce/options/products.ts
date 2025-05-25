import {
  getProduct,
  getProducts,
} from "@/integrations/salesforce/server/products";
import { queryOptions } from "@tanstack/react-query";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";
export const getProductsQueryOptions = (params: any) => {
  return queryOptions<ShopperSearchTypes.ProductSearchResult>({
    queryKey: ["products", "list", params],
    queryFn: async () => getProducts({ data: params }) as any,
  });
};

export const getProductQueryOptions = (params: any) => {
  return queryOptions({
    queryKey: ["product", params],
    queryFn: async () => {
      return getProduct({ data: params });
    },
  });
};
