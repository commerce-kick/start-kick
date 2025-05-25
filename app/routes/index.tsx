// app/routes/index.tsx
import { buttonVariants } from "@/components/ui/button";
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context, params }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductsQueryOptions({
        refine: ["cgid=root"],
        limit: 10,
      })
    );
  },
});

function Home() {
  const { data: products } = useSuspenseQuery(
    getProductsQueryOptions({
      refine: ["cgid=root"],
      limit: 10,
    })
  );

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
              className={buttonVariants({
                variant: "default",
              })}
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
