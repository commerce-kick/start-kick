import { ShopperBasketsTypes } from "commerce-sdk-isomorphic";

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
  usid?: string;
}

export interface ProductSearchParams {
  select?: string;
  q?: string;
  refine?: Array<string>;
  sort?: string;
  currency?: string;
  locale?: string;
  expand?: Array<string>;
  allImages?: boolean;
  perPricebook?: boolean;
  allVariationProperties?: boolean;
  offset?: any;
  limit?: number;
}

export interface GetProductParams {
  id: string;
  select?: string;
  inventoryIds?: string;
  currency?: string;
  expand?: Array<string>;
  locale?: string;
  allImages?: boolean;
  perPricebook?: boolean;
}

export interface GetProductsByIdsParams {
  select?: string;
  ids: string;
  inventoryIds?: string;
  currency?: string;
  expand?: Array<string>;
  locale?: string;
  allImages?: boolean;
  perPricebook?: boolean;
}

export interface AddItemToBasketParams {
  body: Array<ShopperBasketsTypes.ProductItem>;
}
export interface UpdateShippingAddressForShipmentParams {
  params: {
    basketId: string;
    shipmentId: string;
    useAsBilling?: boolean;
    removeExternalTax?: boolean;
  };
  body: ShopperBasketsTypes.OrderAddress;
}

export interface UpdateShippingMethodParams {
  params: {
    basketId: string;
    shipmentId: string;
  };
  body: ShopperBasketsTypes.Shipment;
}

export interface UpdateShippingMethodForShipmentParams {
  params: {
    basketId: string;
    shipmentId: string;
  };
  body: ShopperBasketsTypes.ShippingMethod;
}

export interface AddPaymentInstrumentToBasketParams {
  params: {
    basketId: string;
  };
  body: ShopperBasketsTypes.OrderPaymentInstrument;
}

export interface CreateOrderParams {
  params?: {};
  body: ShopperBasketsTypes.Basket;
}
