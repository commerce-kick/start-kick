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
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: number;
  customerId?: string;
}
