import { ProductListTypes } from "@/integrations/salesforce/enums";
import {
  addItemToProductList,
  createProductList,
  customerProductLists,
  getCustomer,
  getCustomerOrders,
} from "@/integrations/salesforce/server/customer";
import { CustomerOrdersParams } from "@/integrations/salesforce/types";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";

export const getCustomerQueryOptions = () => {
  return queryOptions<ShopperCustomersTypes.Customer>({
    queryKey: ["customers"],
    queryFn: async () => getCustomer(),
  });
};

export const getCustomerOrdersQueryOptions = (data: CustomerOrdersParams) => {
  return queryOptions({
    queryKey: ["customers", "orders", { ...data }],
    queryFn: async () => getCustomerOrders({ data }),
  });
};

export const getProductListQueryOptions = () => {
  return queryOptions({
    queryKey: ["customers", "productLists"],
    queryFn: async () => customerProductLists(),
  });
};

export const useCreateProductListMutation = () => {
  return useMutation({
    mutationFn: async (data: { type: ProductListTypes }) => {
      return createProductList({ data });
    },
    meta: {
      invalidateQuery: getProductListQueryOptions().queryKey,
    },
  });
};

export const useAddItemToProductListMutation = () => {
  return useMutation({
    mutationFn: async (data: { listId: string; productId: string }) => {
      return addItemToProductList({ data });
    },
    meta: {
      sucessMessage: "Done",
      invalidateQuery: getProductListQueryOptions().queryKey,
    },
  });
};
