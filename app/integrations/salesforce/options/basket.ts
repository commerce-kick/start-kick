import {
  addItemToNewOrExistingBasket,
  addPaymentInstrumentToBasket,
  deleteBasket,
  getBasket,
  getShippingMethodsForShipment,
  mergeBasket,
  updateCustomerForBasket,
  updateShippingAddressForShipment,
  updateShippingMethod,
  updateShippingMethodForShipment,
} from "@/integrations/salesforce/server/basket";
import {
  AddItemToBasketParams,
  AddPaymentInstrumentToBasketParams,
  UpdateShippingAddressForShipmentParams,
  UpdateShippingMethodForShipmentParams,
  UpdateShippingMethodParams,
} from "@/integrations/salesforce/types";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useAddItemToBasketMutation = () => {
  return useMutation({
    mutationFn: async (params: AddItemToBasketParams) =>
      addItemToNewOrExistingBasket({ data: params }),
    meta: {
      sucessMessage: "Product Added",
      errorMessage: "Something went worng",
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useMergeBasketMutation = () => {
  return useMutation({
    mutationFn: async () => mergeBasket(),
  });
};

export const useUpdateCustomerForBasketMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; basketId: string }) =>
      updateCustomerForBasket({ data }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useDeleteBasketMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { basketId: string }) => deleteBasket({ data }),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useUpdateShippingAddressForShipmentMutation = () => {
  return useMutation({
    mutationFn: async (data: UpdateShippingAddressForShipmentParams) =>
      updateShippingAddressForShipment({ data }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useUpdateShippingMethodMutation = () => {
  return useMutation({
    mutationFn: async (data: UpdateShippingMethodParams) =>
      updateShippingMethod({ data }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useUpdateShippingMethodForShipmentMutation = () => {
  return useMutation({
    mutationFn: async (data: UpdateShippingMethodForShipmentParams) =>
      updateShippingMethodForShipment({ data }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const useAddPaymentInstrumentToBasketMutation = () => {
  return useMutation({
    mutationFn: async (data: AddPaymentInstrumentToBasketParams) =>
      addPaymentInstrumentToBasket({ data }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const getShippingMethodsForShipmentQueryOptions = ({
  basketId,
}: {
  basketId: string;
}) => {
  return queryOptions({
    queryKey: ["basket", "shippingMethods", { basketId }],
    queryFn: async () => getShippingMethodsForShipment({ data: { basketId } }),
    meta: {
      invalidateQuery: getBasketQueryOptions().queryKey,
    },
  });
};

export const getBasketQueryOptions = () => {
  return queryOptions({
    queryKey: ["basket"],
    queryFn: async () => getBasket(),
  });
};
