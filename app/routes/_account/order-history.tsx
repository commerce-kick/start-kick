import { getCustomerOrdersQueryOptions } from "@/integrations/salesforce/options/customer";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { CommercePagination } from "@/components/commerce/commerce-pagination";
import OrderDetails from "@/components/commerce/order-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { REQUESTED_LIMIT } from "@/integrations/salesforce/constants";
import { z } from "zod";

export const Route = createFileRoute("/_account/order-history")({
  component: RouteComponent,
  validateSearch: z.object({
    offset: z.number().optional(),
  }),
  loader: async ({ context, params }) => {
    const { queryClient } = context;

    queryClient.ensureQueryData(
      getCustomerOrdersQueryOptions({ limit: REQUESTED_LIMIT, ...params }),
    );
  },
});

function RouteComponent() {
  const { offset = 0 } = useSearch({ from: "/_account/order-history" });

  const { data }: { data: ShopperCustomersTypes.CustomerOrderResult } =
    useSuspenseQuery(
      getCustomerOrdersQueryOptions({ offset, limit: REQUESTED_LIMIT }),
    );

  const navigate = useNavigate({ from: "/order-history" });

  const [selectedOrder, setSelectedOrder] =
    useState<ShopperCustomersTypes.Order | null>(null);

  const orders = data?.data || [];
  const totalOrders = data?.total || 0;

  const getStatusBadge = (
    status: string,
    type: "order" | "payment" | "shipping" | "confirmation",
  ) => {
    const statusConfig = {
      order: {
        created: {
          variant: "secondary" as const,
          icon: Clock,
          label: "Created",
        },
        confirmed: {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Confirmed",
        },
        cancelled: {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Cancelled",
        },
        completed: {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Completed",
        },
      },
      payment: {
        not_paid: {
          variant: "destructive" as const,
          icon: AlertCircle,
          label: "Not Paid",
        },
        paid: { variant: "default" as const, icon: CheckCircle, label: "Paid" },
        partially_paid: {
          variant: "secondary" as const,
          icon: Clock,
          label: "Partially Paid",
        },
      },
      shipping: {
        not_shipped: {
          variant: "secondary" as const,
          icon: Package,
          label: "Not Shipped",
        },
        shipped: { variant: "default" as const, icon: Truck, label: "Shipped" },
        delivered: {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Delivered",
        },
      },
      confirmation: {
        not_confirmed: {
          variant: "secondary" as const,
          icon: Clock,
          label: "Pending",
        },
        confirmed: {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Confirmed",
        },
      },
    };

    const config = statusConfig[type][
      status as keyof (typeof statusConfig)[typeof type]
    ] || {
      variant: "outline" as const,
      icon: AlertCircle,
      label: status,
    };

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

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

  if (orders.length === 0) {
    return (
      <>
        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Order History</h1>
        </div>

        <Card className="py-12 text-center">
          <CardContent>
            <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h2 className="mb-2 text-2xl font-semibold">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your
              order history here.
            </p>
            <Button size="lg">Start Shopping</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"} total
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.orderNo} className="overflow-hidden py-0">
            <CardHeader className="bg-muted/50 py-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    Order #{order.orderNo}
                    {getStatusBadge(order.status, "order")}
                  </CardTitle>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {order.creationDate
                        ? format(new Date(order.creationDate), "MMM dd, yyyy")
                        : "Unknown date"}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(order.orderTotal, order.currency)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(order.paymentStatus, "payment")}
                  {getStatusBadge(order.shippingStatus, "shipping")}
                  {getStatusBadge(order.confirmationStatus, "confirmation")}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Order Items */}
                <div className="space-y-4 lg:col-span-2">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Package className="h-4 w-4" />
                    Items ({order.productItems?.length || 0})
                  </h3>

                  <div className="space-y-3">
                    {order.productItems?.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 flex items-center justify-between rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.productName || item.itemText}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(item.price, order.currency)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {(order.productItems?.length || 0) > 3 && (
                      <p className="text-muted-foreground text-center text-sm">
                        +{(order.productItems?.length || 0) - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Summary</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {formatCurrency(order.productSubTotal, order.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {formatCurrency(order.shippingTotal, order.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>
                        {formatCurrency(order.taxTotal, order.currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(order.orderTotal, order.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipments?.[0]?.shippingAddress && (
                    <div className="border-t pt-4">
                      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                        <MapPin className="h-3 w-3" />
                        Shipping Address
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {order.shipments[0].shippingAddress.fullName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatAddress(order.shipments[0].shippingAddress)}
                      </p>
                    </div>
                  )}

                  {/* Payment Method */}
                  {order.paymentInstruments?.[0]?.paymentCard && (
                    <div className="border-t pt-4">
                      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                        <CreditCard className="h-3 w-3" />
                        Payment Method
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {order.paymentInstruments[0].paymentCard.cardType}{" "}
                        ending in{" "}
                        {
                          order.paymentInstruments[0].paymentCard
                            .numberLastDigits
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Order #{order.orderNo} Details
                        </DialogTitle>
                      </DialogHeader>
                      <OrderDetails order={order} />
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                </div>

                {order.shippingStatus === "shipped" && (
                  <Button size="sm">
                    <Truck className="mr-2 h-4 w-4" />
                    Track Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {JSON.stringify({
        total: data.total,
        offset: data.offset,
      })}

      {/* Pagination */}
      <CommercePagination
        total={data.total}
        offset={data.offset}
        requestedLimit={1}
        navigate={navigate}
      />
    </>
  );
}
