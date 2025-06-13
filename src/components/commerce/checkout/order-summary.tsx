import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  basket: any;
}

export function OrderSummary({ basket }: OrderSummaryProps) {
  if (!basket) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-muted-foreground text-center">
            Loading cart...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {basket.productItems?.length || 0}{" "}
          {basket.productItems?.length === 1 ? "item" : "items"} in cart
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-4">
          {basket.productItems?.map((item: any) => (
            <div key={item.itemId} className="flex gap-4">
              <div className="bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                    {item.productName?.charAt(0) || "P"}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-medium">{item.productName}</h3>
                <p className="text-muted-foreground text-sm">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-medium">
                  ${Number.parseFloat(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              ${Number.parseFloat(basket.productSubTotal || 0).toFixed(2)}
            </span>
          </div>
          {basket.shippingTotal && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>${Number.parseFloat(basket.shippingTotal).toFixed(2)}</span>
            </div>
          )}
          {basket.taxTotal && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${Number.parseFloat(basket.taxTotal).toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              $
              {Number.parseFloat(
                basket.orderTotal || basket.productTotal || 0,
              ).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Promotions */}
        {basket.shipments?.[0]?.shippingMethod?.shippingPromotions?.length >
          0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Applied Promotions</h3>
              {basket.shipments[0].shippingMethod.shippingPromotions.map(
                (promo: any, index: number) => (
                  <div
                    key={promo.promotionId || index}
                    className="text-sm text-green-600"
                  >
                    {promo.calloutMsg}
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
