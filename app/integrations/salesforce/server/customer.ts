import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import {
  getSalesforceAPI,
  salesforceConfig,
} from "@/integrations/salesforce/server/config";
import { useAppSession } from "@/utils/session";
import { createServerFn } from "@tanstack/react-start";

export const authenticateCustomer = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const client = new SalesforceCommerceClient(salesforceConfig, session);
    await client.authenticateCustomer(data.username, data.password);
    return { success: true };
  });

export const logoutCustomer = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();
    const client = new SalesforceCommerceClient(salesforceConfig, session);
    await client.logout();
    return { success: true };
  },
);

export const getCustomer = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await useAppSession();
    const api = await getSalesforceAPI();
    const shopperProducts = await api.shopperCustomers();
    return await shopperProducts.getCustomer({
      parameters: {
        customerId: data.customerId,
      },
    });
  },
);
