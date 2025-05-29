import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ReviewProps {
  basket: any;
  customer: any;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export function Review({
  basket,
  customer,
  onBack,
  onPlaceOrder,
}: ReviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Order</CardTitle>
          <CardDescription>
            Please review your information before placing your order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="mb-2 font-semibold">Contact Information</h3>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>
                {customer?.firstName} {customer?.lastName}
              </p>
              <p>{customer?.email}</p>
              <p>{customer?.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="mb-2 font-semibold">Shipping Address</h3>
            <div className="text-muted-foreground space-y-1 text-sm">
              {basket?.shipments?.[0]?.shippingAddress && (
                <>
                  <p>
                    {basket.shipments[0].shippingAddress.firstName}{" "}
                    {basket.shipments[0].shippingAddress.lastName}
                  </p>
                  <p>{basket.shipments[0].shippingAddress.address1}</p>
                  {basket.shipments[0].shippingAddress.address2 && (
                    <p>{basket.shipments[0].shippingAddress.address2}</p>
                  )}
                  <p>
                    {basket.shipments[0].shippingAddress.city},{" "}
                    {basket.shipments[0].shippingAddress.stateCode}{" "}
                    {basket.shipments[0].shippingAddress.postalCode}
                  </p>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Shipping Method */}
          <div>
            <h3 className="mb-2 font-semibold">Shipping Method</h3>
            <div className="text-muted-foreground text-sm">
              {basket?.shipments?.[0]?.shippingMethod && (
                <div className="flex justify-between">
                  <span>{basket.shipments[0].shippingMethod.name}</span>
                  <span>{basket.shipments[0].shippingMethod.price}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="mb-2 font-semibold">Payment Method</h3>
            <div className="text-muted-foreground text-sm">
              {basket?.paymentInstruments?.[0] && (
                <>
                  <p>
                    Card ending in{" "}
                    {basket.paymentInstruments[0].paymentCard?.maskedNumber?.slice(
                      -4,
                    )}
                  </p>
                  <p>
                    Expires{" "}
                    {basket.paymentInstruments[0].paymentCard?.expirationMonth}/
                    {basket.paymentInstruments[0].paymentCard?.expirationYear}
                  </p>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="mb-2 font-semibold">Order Items</h3>
            <div className="space-y-3">
              {basket?.productItems?.map((item: any) => (
                <div key={item.itemId} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Payment
        </Button>
        <Button onClick={onPlaceOrder} size="lg">
          Place Order
        </Button>
      </div>
    </div>
  );
}
