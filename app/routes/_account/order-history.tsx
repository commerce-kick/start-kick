import { AccountPageSkeleton } from "@/components/commerce/account/account-page-skeleton";
import { CommercePagination } from "@/components/commerce/commerce-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { REQUESTED_LIMIT } from "@/integrations/salesforce/constants";
import { getCustomerOrdersQueryOptions } from "@/integrations/salesforce/options/customer";
import { Address } from "@/integrations/salesforce/types/api";
import { formatAddress, formatCurrency } from "@/lib/commerce";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
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
import { Suspense } from "react";
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

const getStatusBadge = (
  status: string,
  type: "order" | "payment" | "shipping" | "confirmation",
) => {
  const statusConfig: StatusTypeMap = {
    order: {
      created: {
        variant: "secondary",
        icon: Clock,
        label: "Created",
      },
      confirmed: {
        variant: "default",
        icon: CheckCircle,
        label: "Confirmed",
      },
      cancelled: {
        variant: "destructive",
        icon: XCircle,
        label: "Cancelled",
      },
      completed: {
        variant: "default",
        icon: CheckCircle,
        label: "Completed",
      },
    },
    payment: {
      not_paid: {
        variant: "destructive",
        icon: AlertCircle,
        label: "Not Paid",
      },
      paid: { variant: "default", icon: CheckCircle, label: "Paid" },
      partially_paid: {
        variant: "secondary",
        icon: Clock,
        label: "Partially Paid",
      },
    },
    shipping: {
      not_shipped: {
        variant: "secondary",
        icon: Package,
        label: "Not Shipped",
      },
      shipped: { variant: "default", icon: Truck, label: "Shipped" },
      delivered: {
        variant: "default",
        icon: CheckCircle,
        label: "Delivered",
      },
    },
    confirmation: {
      not_confirmed: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        variant: "default",
        icon: CheckCircle,
        label: "Confirmed",
      },
    },
  };

  const defaultConfig: StatusConfig = {
    variant: "outline",
    icon: AlertCircle,
    label: status,
  };

  const config = statusConfig[type][status] || defaultConfig;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

function OrderHistoryContent() {
  const { offset = 0 } = useSearch({ from: "/_account/order-history" });
  const navigate = useNavigate({ from: "/order-history" });

  const { data } = useSuspenseQuery(
    getCustomerOrdersQueryOptions({ offset, limit: REQUESTED_LIMIT }),
  );

  const orders = data?.data || [];
  const totalOrders = data?.total || 0;

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <ShoppingBag className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">View your past orders</p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingBag className="text-muted-foreground mb-4 h-16 w-16" />
            <h2 className="mb-2 text-2xl font-semibold">No orders found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't placed any orders yet. Start shopping to see your
              order history here.
            </p>
            <Button size="lg">Start Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <ShoppingBag className="text-primary h-5 w-5" />
          </div>
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
              <CardTitle className="flex items-center gap-2">
                Order #{order.orderNo}
                {getStatusBadge(order.status, "order")}
              </CardTitle>

              <div className="flex flex-wrap gap-2">
                <Badge className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {order.creationDate
                    ? format(new Date(order.creationDate), "MMM dd, yyyy")
                    : "Unknown date"}
                </Badge>
                <Badge className="flex items-center gap-1">
                  {formatCurrency(order.orderTotal, order.currency)}
                </Badge>
                {getStatusBadge(order.paymentStatus, "payment")}
                {getStatusBadge(order.shippingStatus, "shipping")}
                {getStatusBadge(order.confirmationStatus, "confirmation")}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                        {formatAddress(
                          order.shipments[0].shippingAddress as Address,
                        )}
                      </p>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.billingAddress && (
                    <div className="border-t pt-4">
                      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3 w-3" />
                        Billing Address
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {order.billingAddress.fullName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatAddress(order.billingAddress as Address)}
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
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to="/orders/$orderId"
                      params={{ orderId: order.orderNo! }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>

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

      {/* Pagination */}
      <CommercePagination
        total={data.total}
        offset={data.offset}
        requestedLimit={REQUESTED_LIMIT}
        navigate={navigate}
      />
    </div>
  );
}

function RouteComponent() {
  return (
    <Suspense
      fallback={<AccountPageSkeleton variant="list" cards={3} cardItems={3} />}
    >
      <OrderHistoryContent />
    </Suspense>
  );
}

type StatusConfig = {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ElementType;
  label: string;
};

type StatusConfigMap = {
  [key: string]: StatusConfig;
};

type StatusTypeMap = {
  order: StatusConfigMap;
  payment: StatusConfigMap;
  shipping: StatusConfigMap;
  confirmation: StatusConfigMap;
};
