import { SalesforceAPI } from "@/integrations/salesforce/api";
import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import { useAppSession } from "@/utils/session";
import { createServerFn } from "@tanstack/react-start";

const salesforceConfig = {
  clientId: process.env.VITE_SFCC_CLIENT_ID!,
  organizationId: process.env.VITE_SFCC_ORG_ID!,
  shortCode: process.env.VITE_SFCC_SHORT_CODE!,
  siteId: process.env.VITE_SFCC_SITE_ID!,
};

async function getSalesforceAPI() {
  const session = await useAppSession();
  const client = new SalesforceCommerceClient(salesforceConfig, session);
  return new SalesforceAPI(client, salesforceConfig);
}

export const getProducts = createServerFn({ method: "GET" })
  .validator(
    (data: { refine?: string[]; limit?: number; offset?: number } = {}) => data
  )
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.productSearch({
      parameters: {
        refine: data.refine || ["cgid=root"],
        limit: data.limit || 10,
        offset: data.offset || 0,
      },
    });
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((data: { productId: string; expand?: string[] }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getProduct({
      parameters: {
        id: data.productId,
        allImages: true,
        expand: data.expand || ["prices", "images", "variations"],
      },
    });
  });

export const searchProducts = createServerFn({ method: "GET" })
  .validator(
    (data: { q: string; refine?: string[]; limit?: number; offset?: number }) =>
      data
  )
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.productSearch({
      parameters: {
        q: data.q,
        refine: data.refine,
        limit: data.limit || 20,
        offset: data.offset || 0,
      },
    });
  });

export const getCategories = createServerFn({ method: "GET" })
  .validator((data: { levels?: number } = {}) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperProducts = await api.shopperProducts();
    return await shopperProducts.getCategories({
      parameters: {
        levels: data.levels || 1,
      },
    });
  });

export const createBasket = createServerFn({ method: "POST" })
  .validator((data: any = {}) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperBaskets = await api.shopperBaskets();
    return await shopperBaskets.createBasket({
      body: data,
    });
  });

export const getBasket = createServerFn({ method: "GET" })
  .validator((data: { basketId: string }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperBaskets = await api.shopperBaskets();
    return await shopperBaskets.getBasket({
      parameters: {
        basketId: data.basketId,
      },
    });
  });

export const addItemToBasket = createServerFn({ method: "POST" })
  .validator((data: { basketId: string; body: any }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperBaskets = await api.shopperBaskets();
    return await shopperBaskets.addItemToBasket({
      parameters: {
        basketId: data.basketId,
      },
      body: data.body,
    });
  });

export const getCustomer = createServerFn({ method: "GET" })
  .validator((data: { customerId: string }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperCustomers = await api.shopperCustomers();
    return await shopperCustomers.getCustomer({
      parameters: {
        customerId: data.customerId,
      },
    });
  });

export const createCustomer = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI();
    const shopperCustomers = await api.shopperCustomers();
    return await shopperCustomers.registerCustomer({
      body: data,
    });
  });

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
