import { getCustomer } from "@/integrations/salesforce/server/customer";
import { queryOptions } from "@tanstack/react-query";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";

export const getCustomerQueryOptions = () => {
  return queryOptions<ShopperCustomersTypes.Customer>({
    queryKey: ["customers"],
    queryFn: async () => getCustomer(),
    retry: false,
  });
};
