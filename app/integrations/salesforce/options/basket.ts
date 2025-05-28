import {
    addItemToNewOrExistingBasket,
    getBasket,
} from "@/integrations/salesforce/server/basket";
import { AddItemToBasketParams } from "@/integrations/salesforce/types";
import { queryOptions, useMutation } from "@tanstack/react-query";

export const useAddItemToBasketMutation = () => {
  return useMutation({
    mutationFn: async (params: AddItemToBasketParams) =>
      addItemToNewOrExistingBasket({ data: params }),
    meta: {
      sucessMessage: "Product Added",
      errorMessage: "Something went worng",
      invalidateQuery: ["basket"],
    },
  });
};

export const getBasketQueryOptions = () => {
  return queryOptions({
    queryKey: ["basket"],
    queryFn: async () => getBasket(),
  });
};
