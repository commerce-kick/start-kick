import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { AddItemToBasketParams } from "@/integrations/salesforce/types";
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
