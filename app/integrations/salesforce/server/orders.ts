import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { CreateOrderParams } from "@/integrations/salesforce/types/params";
import { createServerFn } from "@tanstack/react-start";

export const createOrder = createServerFn({ method: "POST" })
  .validator((data: CreateOrderParams) => data)
  .handler(async ({ data }) => {
    const { api, client } = await getSalesforceAPI();
    const shopperOrders = await api.shopperOrders();

    return await shopperOrders.createOrder({
      parameters: data.params,
      body: data.body,
    });
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator((data: { orderNo: string }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperOrders = await api.shopperOrders();

    return await shopperOrders.getOrder({
      parameters: {
        orderNo: data.orderNo,
      },
    });
  });
