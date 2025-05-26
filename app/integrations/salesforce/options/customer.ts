import { getCustomer } from "@/integrations/salesforce/server/customer";
import { queryOptions } from "@tanstack/react-query";

export const getCustomerQueryOptions = () => {
  return queryOptions({
    queryKey: ["customers"],
    queryFn: async () => getCustomer(),
    retry: false
  });
};
