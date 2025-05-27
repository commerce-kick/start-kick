import {
  getProduct,
  getProducts,
  ProductSearchParams,
} from "@/integrations/salesforce/server/products";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";
export const getProductsQueryOptions = (params: ProductSearchParams) => {
  return queryOptions<ShopperSearchTypes.ProductSearchResult>({
    queryKey: ["products", "list", params],
    queryFn: async () => getProducts({ data: params }) as any,
  });
};

export const getInfinityProductsQueryOptions = (params: {
  refine?: string[];
  limit?: number;
  offset?: number;
}) => {
  return infiniteQueryOptions({
    queryKey: ["products", "infinity", "list", params],
    queryFn: async ({ pageParam }) =>
      getProducts({ data: { ...params, offset: pageParam } }),
    initialPageParam: 0,
    getNextPageParam: (data) => {
      return data.total - data.offset;
    },
    getPreviousPageParam: (data) => {
      return data.offset - 25;
    },
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
