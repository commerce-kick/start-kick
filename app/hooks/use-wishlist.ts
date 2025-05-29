import { ProductListTypes } from "@/integrations/salesforce/enums";
import {
    getProductListQueryOptions,
    useCreateProductListMutation,
} from "@/integrations/salesforce/options/customer";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useWishList = () => {
  const { data, isLoading, error } = useQuery(getProductListQueryOptions());

  const createProductList = useCreateProductListMutation();

  const existingWishList = useMemo(
    () => data?.data?.find((pl) => pl.type === ProductListTypes.WISH_LIST),
    [data?.data],
  );

  const shouldCreateWishList = useMemo(
    () =>
      data?.total === 0 &&
      !existingWishList &&
      !createProductList.isPending &&
      !createProductList.data,
    [
      data?.total,
      existingWishList,
      createProductList.isPending,
      createProductList.data,
    ],
  );

  // Auto-create wishlist when needed
  if (shouldCreateWishList) {
    createProductList.mutate({
      type: ProductListTypes.WISH_LIST,
    });
  }

  return {
    wishList: existingWishList || createProductList.data,
    isLoading: isLoading || createProductList.isPending,
    error: error || createProductList.error,
    createWishList: createProductList.mutate,
    isCreating: createProductList.isPending,
  };
};
