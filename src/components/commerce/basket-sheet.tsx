import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getBasketQueryOptions } from "@/integrations/salesforce/options/basket";
import { getProductsByIdsQueryOptions } from "@/integrations/salesforce/options/products";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function BasketSheet() {
  const [open, setOpen] = useState(false);
  const { data: basket, isLoading: basketLoading } = useQuery(
    getBasketQueryOptions(),
  );

  // Extract product IDs from basket items
  const productIds =
    basket?.productItems
      ?.map((item) => item.productId)
      .filter(Boolean)
      .join(",") || "";

  // Fetch full product details
  const { data: productsResult, isLoading: productsLoading } = useQuery({
    ...getProductsByIdsQueryOptions({ ids: productIds }),
    enabled: productIds.length > 0,
  });

  const isLoading = basketLoading || productsLoading;
  const itemCount =
    basket?.productItems?.reduce(
      (total, item) => total + (item.quantity || 0),
      0,
    ) || 0;

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Combine basket items with full product data
  const enhancedItems =
    basket?.productItems?.map((basketItem) => {
      const fullProduct = productsResult?.data?.find(
        (product) => product.id === basketItem.productId,
      );
      return {
        ...basketItem,
        product: fullProduct,
      };
    }) || [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : !basket?.productItems || basket.productItems.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start adding some items to your cart!
              </p>
            </div>
          ) : (
            <>
              {/* Enhanced Cart Items */}
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {enhancedItems.map((item, index) => {
                  const product = item.product;
                  const primaryImage =
                    product?.imageGroups?.find(
                      (group) => group.viewType === "large",
                    )?.images?.[0] ||
                    product?.imageGroups?.find(
                      (group) => group.viewType === "small",
                    )?.images?.[0];

                  return (
                    <div
                      key={item.productId || index}
                      className="flex items-start space-x-4 border-b pb-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                        <img
                          src={
                            primaryImage?.disBaseLink ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={product?.name || item.productName || "Product"}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                            {product?.name ||
                              item.productName ||
                              "Unknown Product"}
                          </h4>
                          {product?.brand && (
                            <p className="text-xs text-gray-500">
                              {product.brand}
                            </p>
                          )}
                          {product?.shortDescription && (
                            <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                              {product.shortDescription}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {item.product?.variationValues &&
                              Object.keys(item.product.variationValues).length >
                                0 && (
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(
                                    item.product.variationValues,
                                  ).map(([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {key}: {value}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(item.price, basket.currency)}
                            </div>
                            {item.quantity &&
                              item.price &&
                              item.quantity > 1 && (
                                <div className="text-xs text-gray-500">
                                  {formatPrice(
                                    item.price / item.quantity,
                                    basket.currency,
                                  )}{" "}
                                  each
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Product promotions if available */}
                        {product?.productPromotions &&
                          product.productPromotions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.productPromotions
                                .slice(0, 2)
                                .map((promo, promoIndex) => (
                                  <Badge
                                    key={promoIndex}
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {promo.calloutMsg || "Special Offer"}
                                  </Badge>
                                ))}
                            </div>
                          )}

                        {/* Stock status */}
                        {product?.inventory && (
                          <div className="text-xs">
                            {product.inventory.stockLevel &&
                              product.inventory.stockLevel <= 5 && (
                                <span className="text-orange-600">
                                  Only {product.inventory.stockLevel} left in
                                  stock
                                </span>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {formatPrice(basket.productSubTotal, basket.currency)}
                  </span>
                </div>
                {basket.shippingTotal && basket.shippingTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {formatPrice(basket.shippingTotal, basket.currency)}
                    </span>
                  </div>
                )}
                {basket.taxTotal && basket.taxTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(basket.taxTotal, basket.currency)}</span>
                  </div>
                )}
                {basket.orderPriceAdjustments &&
                  basket.orderPriceAdjustments.length > 0 && (
                    <div className="space-y-1">
                      {basket.orderPriceAdjustments.map((adjustment, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-green-600"
                        >
                          <span>{adjustment.itemText || "Discount"}</span>
                          <span>
                            -
                            {formatPrice(
                              Math.abs(adjustment.price || 0),
                              basket.currency,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                {basket.orderTotal && (
                  <div className="flex justify-between border-t pt-2 text-base font-medium">
                    <span>Total</span>
                    <span>
                      {formatPrice(basket.orderTotal, basket.currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  asChild
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">View Cart</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
