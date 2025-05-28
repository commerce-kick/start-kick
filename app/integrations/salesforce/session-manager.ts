import { SalesforceSessionData } from "@/integrations/salesforce/types";

export class SalesforceSessionManager {
  private session: any;

  constructor(session: any) {
    this.session = session;
  }

  async getTokens() {
    const data = await this.session.data;
    return data || (null as SalesforceSessionData | null);
  }

  async saveTokens(tokenData: {
    accessToken: string;
    customerId: string;
    refreshToken: string;
    tokenExpiry: number;
    usid: string;
  }) {
    console.log(
      "Saving tokens - expires in:",
      Math.round((tokenData.tokenExpiry - Date.now()) / 1000 / 60),
      "minutes",
    );

    await this.session.update({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenExpiry: tokenData.tokenExpiry,
      customerId: tokenData.customerId,
      usid: tokenData.usid,
    });
  }

  async clearTokens() {
    await this.session.update({});
  }

  async isTokenValid(): Promise<boolean> {
    const tokens = await this.getTokens();

    const isValid = !!(
      tokens?.accessToken &&
      tokens?.tokenExpiry &&
      Date.now() < tokens.tokenExpiry
    );

    console.log(
      "Token valid:",
      isValid,
      "expires in:",
      tokens?.tokenExpiry
        ? Math.round((tokens.tokenExpiry - Date.now()) / 1000 / 60) + " min"
        : "no expiry",
    );

    return isValid;
  }
}
