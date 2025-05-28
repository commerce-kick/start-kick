import {
  getProduct,
  getProducts,
  getProductsByIds,
} from "@/integrations/salesforce/server/products";

import type {
  GetProductParams,
  GetProductsByIdsParams,
  ProductSearchParams,
} from "@/integrations/salesforce/types";

import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  ShopperProductsTypes,
  ShopperSearchTypes,
} from "commerce-sdk-isomorphic";

export const getProductsQueryOptions = (params: ProductSearchParams) => {
  return queryOptions<ShopperSearchTypes.ProductSearchResult>({
    queryKey: ["products", "list", params],
    queryFn: async () => getProducts({ data: params }) as any,
  });
};

export const getInfinityProductsQueryOptions = (
  params: ProductSearchParams,
) => {
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

export const getProductQueryOptions = (params: GetProductParams) => {
  return queryOptions<ShopperProductsTypes.Product>({
    queryKey: ["product", params],
    queryFn: async () => {
      return getProduct({ data: params });
    },
  });
};

export const getProductsByIdsQueryOptions = (
  params: GetProductsByIdsParams,
) => {
  return queryOptions({
    queryKey: ["products", params],
    queryFn: async () => getProductsByIds({ data: params }),
  });
};
