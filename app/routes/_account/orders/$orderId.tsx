import { getOrderQueryOptions } from "@/integrations/salesforce/options/orders";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

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

function RouteComponent() {
  const { orderId } = useParams({ from: "/_account/orders/$orderId" });

  const { data: order } = useSuspenseQuery(
    getOrderQueryOptions({
      orderNo: orderId,
    }),
  );

  return <div>{JSON.stringify(order)}</div>;
}
