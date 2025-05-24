import type { SalesforceCommerceClient } from "@/integrations/salesforce/client"
import SDK from "commerce-sdk-isomorphic"

const {
  ShopperBaskets,
  ShopperContexts,
  ShopperCustomers,
  ShopperExperience,
  ShopperLogin,
  ShopperOrders,
  ShopperProducts,
  ShopperPromotions,
  ShopperGiftCertificates,
  ShopperSearch,
  ShopperSeo,
  ShopperStores,
} = SDK

export class SalesforceAPI {
  private client: SalesforceCommerceClient
  private config: any
  private clients: Map<string, any> = new Map()
  private authToken: string | null = null
  private tokenExpiry = 0

  constructor(client: SalesforceCommerceClient, config: any) {
    this.client = client
    this.config = config
  }

  private tokenExpired(): boolean {
    return !this.authToken || Date.now() >= this.tokenExpiry
  }

  private async refreshAuth() {
    this.authToken = await this.client.getAuthToken()
    // Assume token expires in 30 minutes (adjust based on your token settings)
    this.tokenExpiry = Date.now() + 30 * 60 * 1000
    // Clear existing clients to force re-initialization with new token
    this.clients.clear()
  }

  private async getClient<T>(clientClass: any, name: string): Promise<T> {
    if (!this.clients.has(name) || this.tokenExpired()) {
      if (this.tokenExpired()) {
        await this.refreshAuth()
      }

      const client = new clientClass({
        parameters: { ...this.config },
        headers: { Authorization: `Bearer ${this.authToken}` },
      })
      this.clients.set(name, client)
    }
    return this.clients.get(name) as T
  }

  async shopperBaskets() {
    return this.getClient<SDK.ShopperBaskets<any>>(ShopperBaskets, "shopperBaskets")
  }

  async shopperContexts() {
    return this.getClient<SDK.ShopperContexts<any>>(ShopperContexts, "shopperContexts")
  }

  async shopperCustomers() {
    return this.getClient<SDK.ShopperCustomers<any>>(ShopperCustomers, "shopperCustomers")
  }

  async shopperExperience() {
    return this.getClient<SDK.ShopperExperience<any>>(ShopperExperience, "shopperExperience")
  }

  async shopperLogin() {
    return this.getClient<SDK.ShopperLogin<any>>(ShopperLogin, "shopperLogin")
  }

  async shopperOrders() {
    return this.getClient<SDK.ShopperOrders<any>>(ShopperOrders, "shopperOrders")
  }

  async shopperProducts() {
    return this.getClient<SDK.ShopperProducts<any>>(ShopperProducts, "shopperProducts")
  }

  async shopperPromotions() {
    return this.getClient<SDK.ShopperPromotions<any>>(ShopperPromotions, "shopperPromotions")
  }

  async shopperGiftCertificates() {
    return this.getClient<SDK.ShopperGiftCertificates<any>>(ShopperGiftCertificates, "shopperGiftCertificates")
  }

  async shopperSearch() {
    return this.getClient<SDK.ShopperSearch<any>>(ShopperSearch, "shopperSearch")
  }

  async shopperSeo() {
    return this.getClient<SDK.ShopperSeo<any>>(ShopperSeo, "shopperSeo")
  }

  async shopperStores() {
    return this.getClient<SDK.ShopperStores<any>>(ShopperStores, "shopperStores")
  }

  // Helper method to manually refresh if needed
  async forceRefresh() {
    await this.refreshAuth()
  }

  // Get current auth status
  getAuthStatus() {
    return {
      hasToken: !!this.authToken,
      tokenExpired: this.tokenExpired(),
      expiresAt: new Date(this.tokenExpiry).toISOString(),
    }
  }

  // Clear all cached clients (useful for logout)
  clearCache() {
    this.clients.clear()
    this.authToken = null
    this.tokenExpiry = 0
  }
}
