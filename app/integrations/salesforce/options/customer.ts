import { ProductListTypes } from "@/integrations/salesforce/enums";
import {
  addItemToProductList,
  createCustomerAdress,
  createProductList,
  customerProductLists,
  getCustomer,
  getCustomerOrders,
} from "@/integrations/salesforce/server/customer";
import { Customer } from "@/integrations/salesforce/types/api";
import {
  CreateCustomerAddressParams,
  CustomerOrdersParams,
} from "@/integrations/salesforce/types/params";
import { queryOptions, useMutation } from "@tanstack/react-query";

export const getCustomerQueryOptions = () => {
  return queryOptions<Customer>({
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

export const useCreateCustumerAddressMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateCustomerAddressParams) =>
      createCustomerAdress({ data }),
    meta: {
      sucessMessage: "New Address created",
      invalidateQuery: getCustomerQueryOptions().queryKey,
    },
  });
};
