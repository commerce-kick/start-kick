import SearchHit from "@/components/commerce/search-hit";
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category/$categoryId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductsQueryOptions({
        refine: [`cgid:${params.categoryId}`],
        limit: 12,
      })
    );
  },
});

function RouteComponent() {
  const { categoryId } = Route.useParams();

  const { data } = useSuspenseQuery(
    getProductsQueryOptions({
      refine: [`cgid=${categoryId}`],
      limit: 12,
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {data.total > 0 && data.hits.map((product) => (
        <SearchHit product={product} key={product.productId} />
      ))}
    </div>
  );
}
