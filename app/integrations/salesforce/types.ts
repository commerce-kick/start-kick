export interface SalesforceConfig {
  clientId: string;
  organizationId: string;
  siteId: string;
  shortCode: string;
  locale?: string;
  currency?: string;
}

export interface IntegrationConfig {
  parameters: SalesforceConfig;
}

export interface SalesforceSessionData {
  salesforce?: {
    accessToken: string;
    refreshToken?: string;
    tokenExpiry: number;
    customerToken?: string;
    customerId?: string;
  };
}
