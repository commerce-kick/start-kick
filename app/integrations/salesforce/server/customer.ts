import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import { salesforceConfig } from "@/integrations/salesforce/server/config";
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
  }
);

export const getAuthStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    const client = new SalesforceCommerceClient(salesforceConfig, session);
    return {
      isAuthenticated: await client.isAuthenticated(),
      isCustomerAuthenticated: await client.isCustomerAuthenticated(),
      customerId: await client.getCustomerId(),
    };
  }
);
