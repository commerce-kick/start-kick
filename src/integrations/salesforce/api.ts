import type { SalesforceCommerceClient } from "@/integrations/salesforce/client";
import {
  ShopperBaskets,
  ShopperContexts,
  ShopperCustomers,
  ShopperExperience,
  ShopperGiftCertificates,
  ShopperLogin,
  ShopperOrders,
  ShopperProducts,
  ShopperPromotions,
  ShopperSearch,
  ShopperSEO,
  ShopperStores,
} from "./sdk";

export class SalesforceAPI {
  private client: SalesforceCommerceClient;
  private config: any;
  private clients: Map<string, any> = new Map();
  private authToken: string | null = null;
  private tokenExpiry = 0;

  constructor(client: SalesforceCommerceClient, config: any) {
    this.client = client;
    this.config = config;
  }

  private tokenExpired(): boolean {
    return !this.authToken || Date.now() >= this.tokenExpiry;
  }

  private async refreshAuth() {
    this.authToken = await this.client.getAuthToken();
    // Assume token expires in 30 minutes (adjust based on your token settings)
    this.tokenExpiry = Date.now() + 30 * 60 * 1000;
    // Clear existing clients to force re-initialization with new token
    this.clients.clear();
  }

  private async getClient<T>(clientClass: any, name: string): Promise<T> {
    if (!this.clients.has(name) || this.tokenExpired()) {
      if (this.tokenExpired()) {
        await this.refreshAuth();
      }

      const client = new clientClass({
        parameters: { ...this.config },
        headers: { Authorization: `Bearer ${this.authToken}` },
      });
      this.clients.set(name, client);
    }
    return this.clients.get(name) as T;
  }

  async shopperBaskets() {
    return this.getClient<ShopperBaskets<any>>(
      ShopperBaskets,
      "shopperBaskets",
    );
  }

  async shopperContexts() {
    return this.getClient<ShopperContexts<any>>(
      ShopperContexts,
      "shopperContexts",
    );
  }

  async shopperCustomers() {
    return this.getClient<ShopperCustomers<any>>(
      ShopperCustomers,
      "shopperCustomers",
    );
  }

  async shopperExperience() {
    return this.getClient<ShopperExperience<any>>(
      ShopperExperience,
      "shopperExperience",
    );
  }

  async shopperLogin() {
    return this.getClient<ShopperLogin<any>>(ShopperLogin, "shopperLogin");
  }

  async shopperOrders() {
    return this.getClient<ShopperOrders<any>>(ShopperOrders, "shopperOrders");
  }

  async shopperProducts() {
    return this.getClient<ShopperProducts<any>>(
      ShopperProducts,
      "shopperProducts",
    );
  }

  async shopperPromotions() {
    return this.getClient<ShopperPromotions<any>>(
      ShopperPromotions,
      "shopperPromotions",
    );
  }

  async shopperGiftCertificates() {
    return this.getClient<ShopperGiftCertificates<any>>(
      ShopperGiftCertificates,
      "shopperGiftCertificates",
    );
  }

  async shopperSearch() {
    return this.getClient<ShopperSearch<any>>(ShopperSearch, "shopperSearch");
  }

  async shopperSeo() {
    return this.getClient<ShopperSEO<any>>(ShopperSEO, "shopperSeo");
  }

  async shopperStores() {
    return this.getClient<ShopperStores<any>>(ShopperStores, "shopperStores");
  }

  // Helper method to manually refresh if needed
  async forceRefresh() {
    await this.refreshAuth();
  }

  // Clear all cached clients (useful for logout)
  clearCache() {
    this.clients.clear();
    this.authToken = null;
    this.tokenExpiry = 0;
  }
}
