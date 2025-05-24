import { SalesforceCommerceClient } from "@/integrations/salesforce/client"
import SDK from "commerce-sdk-isomorphic"

const { ShopperProducts, ShopperSearch } = SDK

export class SalesforceAPI {
  private client: SalesforceCommerceClient
  private config: any

  constructor(client: SalesforceCommerceClient, config: any) {
    this.client = client
    this.config = config
  }

  private async getShopperProducts() {
    const authToken = await this.client.getAuthToken()
    return new ShopperProducts({
      parameters: { ...this.config },
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  private async getShopperSearch() {
    const authToken = await this.client.getAuthToken()
    return new ShopperSearch({
      parameters: { ...this.config },
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  async getProducts(options: any) {
    const shopperSearch = await this.getShopperSearch()
    return await shopperSearch.productSearch(options)
  }

  async getProduct(options: any) {
    const shopperProducts = await this.getShopperProducts()
    return await shopperProducts.getProduct(options)
  }

  async searchProducts(options: any) {
    const shopperSearch = await this.getShopperSearch()
    return await shopperSearch.productSearch(options)
  }
}
