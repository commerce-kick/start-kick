import { AccountPageSkeleton } from "@/components/commerce/account/account-page-skeleton";
import OrderDetails from "@/components/commerce/order-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderQueryOptions } from "@/integrations/salesforce/options/orders";
import { formatCurrency } from "@/lib/commerce/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Printer,
  Truck,
  XCircle
} from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_account/orders/$orderId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context;

    queryClient.ensureQueryData(
      getOrderQueryOptions({
        orderNo: params.orderId,
      }),
    );
  },
});

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
        icon: Clock,
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

function OrderDetailsContent() {
  const { orderId } = useParams({ from: "/_account/orders/$orderId" });

  const { data: order } = useSuspenseQuery(
    getOrderQueryOptions({
      orderNo: orderId,
    }),
  );

  // Ensure status values are strings with defaults
  const orderStatus = order.status || "created";
  const paymentStatus = order.paymentStatus || "not_paid";
  const shippingStatus = order.shippingStatus || "not_shipped";
  const confirmationStatus = order.confirmationStatus || "not_confirmed";

  const isShipped = shippingStatus === "shipped";
  const isCancelled = orderStatus === "cancelled";

  return (
    <div className="space-y-6">
      {/* Header with Order Number and Status */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to="/order-history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order History
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Order
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order.orderNo || orderId}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {order.creationDate
                  ? format(new Date(order.creationDate), "MMM dd, yyyy")
                  : "Unknown date"}
              </Badge>
              <Badge className="flex items-center gap-1">
                {formatCurrency(order.orderTotal || 0, order.currency || "USD")}
              </Badge>
              {getStatusBadge(orderStatus, "order")}
              {getStatusBadge(paymentStatus, "payment")}
              {getStatusBadge(shippingStatus, "shipping")}
              {getStatusBadge(confirmationStatus, "confirmation")}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Information (if shipped) */}
      {isShipped && !isCancelled && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5" />
              Tracking Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Tracking Number</p>
                <p className="text-sm">
                  {order.shipments?.[0]?.trackingNumber || "Not available"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Carrier</p>
                <p className="text-sm">
                  {order.shipments?.[0]?.shippingMethod?.name ||
                    "Standard Shipping"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-sm">
                  {order.shipments?.[0]?.shippingMethod
                    ?.c_estimatedArrivalTime || "5-7 business days"}
                </p>
              </div>

              <Button className="w-full">
                <Truck className="mr-2 h-4 w-4" />
                Track Package
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Component */}
      <OrderDetails order={order as ShopperCustomersTypes.Order} />
    </div>
  );
}

function RouteComponent() {
  return (
    <Suspense
      fallback={
        <AccountPageSkeleton variant="default" cards={4} cardItems={3} />
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
