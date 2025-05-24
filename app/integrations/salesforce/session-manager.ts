export class SalesforceSessionManager {
  private session: any

  constructor(session: any) {
    this.session = session
  }

  async getTokens() {
    const data = await this.session.data
    return data?.salesforce || null
  }

  async saveTokens(tokenData: {
    accessToken: string
    refreshToken?: string
    tokenExpiry: number
    customerToken?: string
    customerId?: string
  }) {
    const currentData = await this.session.data
    await this.session.update({
      ...currentData,
      salesforce: { ...currentData?.salesforce, ...tokenData },
    })
  }

  async clearTokens() {
    const currentData = await this.session.data
    await this.session.update({
      ...currentData,
      salesforce: undefined,
    })
  }

  async clearCustomerTokens() {
    const currentData = await this.session.data
    if (currentData?.salesforce) {
      await this.session.update({
        ...currentData,
        salesforce: {
          ...currentData.salesforce,
          customerToken: undefined,
          customerId: undefined,
        },
      })
    }
  }

  async isTokenValid(): Promise<boolean> {
    const tokens = await this.getTokens()
    return !!(tokens?.accessToken && tokens?.tokenExpiry && Date.now() < tokens.tokenExpiry)
  }

  async isCustomerAuthenticated(): Promise<boolean> {
    const tokens = await this.getTokens()
    return !!(tokens?.customerToken && tokens?.customerId)
  }
}
