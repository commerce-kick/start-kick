import { SalesforceAPI } from "@/integrations/salesforce/api";
import { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import { useAppSession } from "@/utils/session";

export const salesforceConfig = {
  clientId: process.env.SFCC_CLIENT_ID!,
  organizationId: process.env.SFCC_ORG_ID!,
  shortCode: process.env.SFCC_SHORT_CODE!,
  siteId: process.env.SFCC_SITE_ID!,
};

export async function getSalesforceAPI() {
  const session = await useAppSession();
  const client = new SalesforceCommerceClient(salesforceConfig, session);
  return {
    api: new SalesforceAPI(client, salesforceConfig),
    client,
  };
}
