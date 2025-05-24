import { salesforceQueries } from "@/integrations/salesforce/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient, salesforceClient } = context;

    // Pre-fetch product details
    const productQuery = salesforceQueries
      .products(salesforceClient)
      .detail(params.productId, {
        expand: ["prices", "images", "variations"],
      });

    await queryClient.ensureQueryData(productQuery);

    return { productQuery };
  },
});

function RouteComponent() {
  const { productQuery } = Route.useLoaderData();
  const { data: product, isLoading } = useQuery(productQuery);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <h1 className="text-4xl">{product?.name}</h1>;
}
