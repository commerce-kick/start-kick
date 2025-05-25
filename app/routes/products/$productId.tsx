import { getProductQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductQueryOptions({
        productId: params.productId,
      })
    );
  },
});

function RouteComponent() {
  const { productId } = Route.useParams();

  const { data: product } = useSuspenseQuery(
    getProductQueryOptions({ productId })
  );

  return <h1 className="text-4xl">{product.name}</h1>;
}
