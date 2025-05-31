import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import { ProductListTypes } from "@/integrations/salesforce/enums";
import {
  getSalesforceAPI,
  salesforceConfig,
} from "@/integrations/salesforce/server/config";
import {
  CreateCustomerAddressParams,
  CustomerOrdersParams,
} from "@/integrations/salesforce/types/params";
import { useAppSession } from "@/utils/session";
import { createServerFn } from "@tanstack/react-start";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";

export const authenticateCustomer = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const client = new SalesforceCommerceClient(salesforceConfig, session);
    await client.authenticateCustomer(data.username, data.password);
    return { success: true };
  });

export const registerCustomer = createServerFn({ method: "POST" })
  .validator(
    (data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { api, client } = await getSalesforceAPI();
    const shopperCustomers = await api.shopperCustomers();

    await shopperCustomers.registerCustomer({
      parameters: {},
      body: {
        customer: {
          login: data.email,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        password: data.password,
      },
    });

    return await client.authenticateCustomer(data.email, data.password);
  });

export const logoutCustomer = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();
    const client = new SalesforceCommerceClient(salesforceConfig, session);
    await client.authenticateAsGuest();
    return { success: true };
  },
);

export const getCustomer = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await useAppSession();
    const { api } = await getSalesforceAPI();
    const shopperProducts = await api.shopperCustomers();
    return await shopperProducts.getCustomer({
      parameters: {
        customerId: data.customerId,
      },
    });
  },
);

export const customerProductLists = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await useAppSession();
    const { api } = await getSalesforceAPI();

    const shopperCustomers = await api.shopperCustomers();

    return await shopperCustomers.getCustomerProductLists({
      parameters: {
        customerId: data.customerId,
      },
    });
  },
);

export const createProductList = createServerFn({ method: "POST" })
  .validator((data: { type: ProductListTypes }) => data)
  .handler(async ({ data }) => {
    const { data: sessionData } = await useAppSession();
    const { api } = await getSalesforceAPI();

    const shopperCustomers = await api.shopperCustomers();

    return shopperCustomers.createCustomerProductList({
      body: {
        type: data.type,
      },
      parameters: {
        customerId: sessionData.customerId,
      },
    });
  });

export const addItemToProductList = createServerFn({ method: "POST" })
  .validator((data: { listId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const { data: sessionData } = await useAppSession();

    const shopperCustomers = await api.shopperCustomers();

    return await shopperCustomers.createCustomerProductListItem({
      parameters: {
        customerId: sessionData.customerId,
        listId: data.listId,
      },
      body: {
        quantity: 1,
        productId: data.productId,
        public: false,
        priority: 1,
        type: "product",
      },
    });
  });

export const getCustomerOrders = createServerFn({ method: "GET" })
  .validator((data: CustomerOrdersParams) => data)
  .handler(async ({ data }) => {
    const { api, client } = await getSalesforceAPI();
    const shopperCustomers = await api.shopperCustomers();
    const customerId = await client.getCustomerId();

    return (await shopperCustomers.getCustomerOrders({
      parameters: {
        customerId,
        ...data,
      },
    })) as ShopperCustomersTypes.CustomerOrderResult;
  });

export const createCustomerAdress = createServerFn({ method: "POST" })
  .validator((data: CreateCustomerAddressParams) => data)
  .handler(async ({ data }) => {
    const { api, client } = await getSalesforceAPI();
    const shopperCustomers = await api.shopperCustomers();
    const customerId = await client.getCustomerId();

    return await shopperCustomers.createCustomerAddress({
      parameters: {
        customerId: customerId,
      },
      body: data.body,
    });
  });
