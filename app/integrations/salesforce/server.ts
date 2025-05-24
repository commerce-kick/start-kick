
import { SalesforceAPI } from "@/integrations/salesforce/api"
import { SalesforceCommerceClient } from "@/integrations/salesforce/client"
import { useAppSession } from "@/utils/session"
import { createServerFn } from "@tanstack/react-start"

const salesforceConfig = {
  clientId: process.env.VITE_SFCC_CLIENT_ID!,
  organizationId: process.env.VITE_SFCC_ORG_ID!,
  shortCode: process.env.VITE_SFCC_SHORT_CODE!,
  siteId: process.env.VITE_SFCC_SITE_ID!,
}

async function getSalesforceClient() {
  const session = await useAppSession()
  return new SalesforceCommerceClient(salesforceConfig, session)
}

async function getSalesforceAPI() {
  const client = await getSalesforceClient()
  return new SalesforceAPI(client, salesforceConfig)
}

export const getProducts = createServerFn({ method: "GET" })
  .validator((data: { refine?: string[]; limit?: number; offset?: number } = {}) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI()
    return await api.getProducts({
      parameters: {
        refine: data.refine || ["cgid=root"],
        limit: data.limit || 10,
        offset: data.offset || 0,
      },
    })
  })

export const getProduct = createServerFn({ method: "GET" })
  .validator((data: { productId: string; expand?: string[] }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI()
    return await api.getProduct({
      parameters: {
        id: data.productId,
        allImages: true,
        expand: data.expand || ["prices", "images", "variations"],
      },
    })
  })

export const searchProducts = createServerFn({ method: "GET" })
  .validator((data: { q: string; refine?: string[]; limit?: number; offset?: number }) => data)
  .handler(async ({ data }) => {
    const api = await getSalesforceAPI()
    return await api.searchProducts({
      parameters: {
        q: data.q,
        refine: data.refine,
        limit: data.limit || 20,
        offset: data.offset || 0,
      },
    })
  })

export const authenticateCustomer = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const client = await getSalesforceClient()
    await client.authenticateCustomer(data.username, data.password)
    return { success: true }
  })

export const logoutCustomer = createServerFn({ method: "POST" }).handler(async () => {
  const client = await getSalesforceClient()
  await client.logout()
  return { success: true }
})

export const getAuthStatus = createServerFn({ method: "GET" }).handler(async () => {
  const client = await getSalesforceClient()
  return {
    isAuthenticated: await client.isAuthenticated(),
    isCustomerAuthenticated: await client.isCustomerAuthenticated(),
    customerId: await client.getCustomerId(),
  }
})
