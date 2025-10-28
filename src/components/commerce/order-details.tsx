import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";
import { format } from "date-fns";

export default function OrderDetails({
  order,
}: {
  order: ShopperCustomersTypes.Order;
}) {
  const formatCurrency = (amount?: number, currency = "USD") => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatAddress = (address?: ShopperCustomersTypes.OrderAddress) => {
    if (!address) return "No address";
    const parts = [
      address.address1,
      address.city && address.stateCode
        ? `${address.city}, ${address.stateCode}`
        : address.city || address.stateCode,
      address.postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{order.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span>
                {order.creationDate
                  ? format(
                      new Date(order.creationDate),
                      "MMM dd, yyyy 'at' h:mm a",
                    )
                  : "Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Status:</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className="font-medium capitalize">
                {order.paymentStatus?.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Status:</span>
              <span className="font-medium capitalize">
                {order.shippingStatus?.replace("_", " ")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{order.customerInfo?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer No:</span>
              <span>{order.customerInfo?.customerNo}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            {order.billingAddress ? (
              <div className="space-y-1">
                <p className="font-medium">{order.billingAddress.fullName}</p>
                <p className="text-muted-foreground text-sm">
                  {formatAddress(order.billingAddress)}
                </p>
                {order.billingAddress.phone && (
                  <p className="text-muted-foreground text-sm">
                    {order.billingAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No billing address</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {order.shipments?.[0]?.shippingAddress ? (
              <div className="space-y-1">
                <p className="font-medium">
                  {order.shipments[0].shippingAddress.fullName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatAddress(order.shipments[0].shippingAddress)}
                </p>
                {order.shipments[0].shippingAddress.phone && (
                  <p className="text-muted-foreground text-sm">
                    {order.shipments[0].shippingAddress.phone}
                  </p>
                )}
                {order.shipments[0].shippingMethod && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm font-medium">Shipping Method</p>
                    <p className="text-sm">
                      {order.shipments[0].shippingMethod.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {order.shipments[0].shippingMethod.description}
                    </p>
                    {order.shipments[0].shippingMethod
                      .c_estimatedArrivalTime && (
                      <p className="text-muted-foreground text-xs">
                        Estimated:{" "}
                        {
                          order.shipments[0].shippingMethod
                            .c_estimatedArrivalTime
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No shipping address</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.productItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium">
                    {item.productName || item.itemText}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Product ID: {item.productId}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.price, order.currency)}
                  </p>
                  {item.tax && (
                    <p className="text-muted-foreground text-sm">
                      Tax: {formatCurrency(item.tax, order.currency)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {order.paymentInstruments && order.paymentInstruments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.paymentInstruments.map((instrument, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {instrument.paymentCard?.cardType} ending in{" "}
                      {instrument.paymentCard?.numberLastDigits}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Expires: {instrument.paymentCard?.expirationMonth}/
                      {instrument.paymentCard?.expirationYear}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Holder: {instrument.paymentCard?.holder}
                    </p>
                    {instrument.paymentCard?.creditCardExpired && (
                      <Badge variant="destructive" className="mt-1">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(instrument.amount, order.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {formatCurrency(order.productSubTotal, order.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(order.shippingTotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(order.taxTotal, order.currency)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(order.orderTotal, order.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
