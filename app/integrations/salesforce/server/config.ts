import { SalesforceAPI } from "@/integrations/salesforce/api";
import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import { useAppSession } from "@/utils/session";

export const salesforceConfig = {
  clientId: process.env.VITE_SFCC_CLIENT_ID!,
  organizationId: process.env.VITE_SFCC_ORG_ID!,
  shortCode: process.env.VITE_SFCC_SHORT_CODE!,
  siteId: process.env.VITE_SFCC_SITE_ID!,
};

export async function getSalesforceAPI() {
  const session = await useAppSession();
  const client = new SalesforceCommerceClient(salesforceConfig, session);
  return {
    api: new SalesforceAPI(client, salesforceConfig),
    client,
  };
}
