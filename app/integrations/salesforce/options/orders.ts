import { getBasketQueryOptions } from "@/integrations/salesforce/options/basket";
import { createOrder } from "@/integrations/salesforce/server/orders";
import { CreateOrderParams } from "@/integrations/salesforce/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

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
