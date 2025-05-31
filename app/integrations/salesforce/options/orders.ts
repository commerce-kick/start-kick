import { getBasketQueryOptions } from "@/integrations/salesforce/options/basket";
import { createOrder, getOrder } from "@/integrations/salesforce/server/orders";
import { CreateOrderParams } from "@/integrations/salesforce/types/params";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const getOrderQueryOptions = (params: { orderNo: string }) => {
  return queryOptions({
    queryKey: ["orders", { ...params }],
    queryFn: async () => getOrder({ data: params }),
  });
};

export const useCreateOrderMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateOrderParams) => createOrder({ data }),
    onSuccess: () => {
      navigate({
        to: "/",
      });
    },
    meta: {
      errorMessage: "Something Went wtong",
      invalidateQuery: getBasketQueryOptions().queryKey,
      sucessMessage: "Order Placed",
    },
  });
};
