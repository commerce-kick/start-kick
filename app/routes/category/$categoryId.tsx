import { getCategoryQueryOptions } from "@/integrations/salesforce/options/search";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category/$categoryId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    if (!params.categoryId) return;

    const { queryClient } = context;
    await queryClient.ensureQueryData(
      getCategoryQueryOptions({
        id: params.categoryId,
        levels: 2,
      })
    );
  },
});

function RouteComponent() {
  const { categoryId } = Route.useParams();

  const { data } = useSuspenseQuery(
    getCategoryQueryOptions({
      id: categoryId,
      levels: 2,
    })
  );

  return <div>{data.id}</div>;
}
