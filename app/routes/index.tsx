// app/routes/index.tsx
import { salesforceQueries } from "@/integrations/salesforce/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context, params }) => {
    const { queryClient, salesforceClient } = context;

    const productsQuery = salesforceQueries.products(salesforceClient).list({
      refine: ["cgid=root"],
      limit: 10,
    });

    await queryClient.ensureQueryData(productsQuery);

    return {
      productsQuery,
    };
  },
});

function Home() {
  const { productsQuery } = Route.useLoaderData();
  const { data: products, isLoading } = useQuery(productsQuery);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {products?.hits?.map((product) => {
        return (
          <div key={product.productId}>
            <h2>{product.productName}</h2>
            <p>{product.price}</p>
            <Link
              to="/products/$productId"
              params={{
                productId: product.productId,
              }}
              className="block py-1 text-blue-800 hover:text-blue-600"
              activeProps={{ className: "text-black font-bold" }}
            >
              View
            </Link>
          </div>
        );
      })}
    </div>
  );
}
