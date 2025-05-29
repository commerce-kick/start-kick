import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import {
  AddItemToBasketParams,
  AddPaymentInstrumentToBasketParams,
  UpdateShippingAddressForShipmentParams,
  UpdateShippingMethodParams,
} from "@/integrations/salesforce/types";
import { createServerFn } from "@tanstack/react-start";

export const addItemToNewOrExistingBasket = createServerFn({ method: "POST" })
  .validator((data: AddItemToBasketParams) => data)
  .handler(async ({ data }) => {
    const { api, client } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();
    const shopperCustomers = await api.shopperCustomers();
    const customerId = await client.getCustomerId();
    let basketId: string | undefined;

    const baskets = await shopperCustomers.getCustomerBaskets({
      parameters: {
        customerId,
      },
    });

    if (baskets.total > 0) {
      basketId = baskets.baskets?.[0].basketId;
    } else {
      const newBasket = shopperBasket.createBasket({
        body: {},
      });

      basketId = (await newBasket).basketId;
    }

    if (!basketId) {
      throw new Error();
    }

    return await shopperBasket.addItemToBasket({
      parameters: {
        basketId,
      },
      body: data.body,
    });
  });

export const mergeBasket = createServerFn({ method: "POST" }).handler(
  async () => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.mergeBasket({
      parameters: {
        createDestinationBasket: true,
      },
    });
  },
);

export const updateCustomerForBasket = createServerFn({ method: "POST" })
  .validator((data: { email: string; basketId: string }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.updateCustomerForBasket({
      parameters: {
        basketId: data.basketId,
      },
      body: {
        email: data.email,
      },
    });
  });

export const deleteBasket = createServerFn({ method: "POST" })
  .validator((data: { basketId: string }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.deleteBasket({
      parameters: {
        basketId: data.basketId,
      },
    });
  });

export const getBasket = createServerFn({ method: "GET" }).handler(async () => {
  const { api, client } = await getSalesforceAPI();
  const shopperBasket = await api.shopperBaskets();
  const shopperCustomers = await api.shopperCustomers();
  const customerId = await client.getCustomerId();
  let basketId: string | undefined;

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
      customerId,
    },
  });

  if (baskets.total > 0) {
    basketId = baskets.baskets?.[0].basketId;
  } else {
    const newBasket = await shopperBasket.createBasket({
      body: {},
    });

    basketId = newBasket.basketId;
  }

  if (!basketId) {
    throw new Error();
  }

  return await shopperBasket.getBasket({
    parameters: {
      basketId,
    },
  });
});

export const updateShippingMethod = createServerFn({ method: "POST" })
  .validator((data: UpdateShippingMethodParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.updateShipmentForBasket({
      body: data.body,
      parameters: data.params,
    });
  });

export const updateShippingMethodForShipment = createServerFn({
  method: "POST",
})
  .validator((data: UpdateShippingMethodParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.updateShippingMethodForShipment({
      parameters: data.params,
      body: data.body,
    });
  });

export const updateShippingAddressForShipment = createServerFn({
  method: "POST",
})
  .validator((data: UpdateShippingAddressForShipmentParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.updateShippingAddressForShipment({
      parameters: data.params,
      body: data.body,
    });
  });

export const getShippingMethodsForShipment = createServerFn({ method: "GET" })
  .validator((data: { basketId: string }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.getShippingMethodsForShipment({
      parameters: {
        basketId: data.basketId,
        shipmentId: "me",
      },
    });
  });

export const addPaymentInstrumentToBasket = createServerFn({ method: "POST" })
  .validator((data: AddPaymentInstrumentToBasketParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperBasket = await api.shopperBaskets();

    return await shopperBasket.addPaymentInstrumentToBasket({
      body: data.body,
      parameters: data.params,
    });
  });
