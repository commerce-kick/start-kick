import { SalesforceSessionManager } from "@/integrations/salesforce/session-manager";
import { SalesforceConfig } from "@/integrations/salesforce/types";
import SDK from "commerce-sdk-isomorphic";

const { ShopperLogin, helpers } = SDK;

export class SalesforceCommerceClient {
  private config: SalesforceConfig;
  private sessionManager: SalesforceSessionManager;
  private shopperLogin: SDK.ShopperLogin<any>;

  constructor(config: SalesforceConfig, session: any) {
    this.config = config;
    this.sessionManager = new SalesforceSessionManager(session);
    this.shopperLogin = new ShopperLogin({
      parameters: {
        clientId: this.config.clientId,
        organizationId: this.config.organizationId,
        shortCode: this.config.shortCode,
        siteId: this.config.siteId,
      },
    });
  }

  async ensureAuthenticated(): Promise<void> {
    if (await this.sessionManager.isTokenValid()) {
      return;
    }

    const tokens = await this.sessionManager.getTokens();
    if (tokens?.refreshToken) {
      try {
        await this.refreshAccessToken();
        return;
      } catch (error) {
        await this.sessionManager.clearTokens();
      }
    }

    await this.authenticateAsGuest();
  }

  private async authenticateAsGuest(): Promise<void> {
    const response = await helpers.loginGuestUser(this.shopperLogin, {
      redirectURI: `${process.env.VITE_APP_URL || "http://localhost:3000"}/callback`,
    });

    await this.sessionManager.saveTokens({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      tokenExpiry: Date.now() + (response.expires_in - 300) * 1000,
    });
  }

  private async refreshAccessToken(): Promise<void> {
    const tokens = await this.sessionManager.getTokens();
    if (!tokens?.refreshToken) throw new Error("No refresh token available");

    const response = await helpers.refreshAccessToken(this.shopperLogin, {
      refreshToken: tokens.refreshToken,
    });

    await this.sessionManager.saveTokens({
      accessToken: response.access_token,
      refreshToken: response.refresh_token || tokens.refreshToken,
      tokenExpiry: Date.now() + (response.expires_in - 300) * 1000,
      customerToken: tokens.customerToken,
      customerId: tokens.customerId,
    });
  }

  async authenticateCustomer(
    username: string,
    password: string
  ): Promise<void> {
    await this.ensureAuthenticated();

    const response = await helpers.loginRegisteredUserB2C(
      this.shopperLogin,
      { username, password },
      {
        redirectURI: `${process.env.VITE_APP_URL || "http://localhost:3000"}/callback`,
      }
    );

    const currentTokens = await this.sessionManager.getTokens();
    await this.sessionManager.saveTokens({
      accessToken: currentTokens!.accessToken,
      refreshToken: currentTokens!.refreshToken,
      tokenExpiry: currentTokens!.tokenExpiry,
      customerToken: response.access_token,
      customerId: response.customer_id,
    });
  }

  async logout(): Promise<void> {
    await this.sessionManager.clearCustomerTokens();
  }

  async clearAllAuthentication(): Promise<void> {
    await this.sessionManager.clearTokens();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.sessionManager.isTokenValid();
  }

  async isCustomerAuthenticated(): Promise<boolean> {
    return await this.sessionManager.isCustomerAuthenticated();
  }

  async getCustomerId(): Promise<string | undefined> {
    const tokens = await this.sessionManager.getTokens();
    return tokens?.customerId;
  }

  async getAuthToken(): Promise<string> {
    await this.ensureAuthenticated();
    const tokens = await this.sessionManager.getTokens();
    return tokens!.customerToken || tokens!.accessToken;
  }
}
