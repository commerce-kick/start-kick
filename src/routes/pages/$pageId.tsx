import { Region } from "@/components/commerce/experience/region";
import { getPageQueryOptions } from "@/integrations/salesforce/options/experience";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/pages/$pageId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { pageId } = params;
    const { queryClient } = context;

    queryClient.ensureQueryData(
      getPageQueryOptions({
        pageId,
      }),
    );
  },
});

function RouteComponent() {
  const { pageId } = useParams({ from: "/pages/$pageId" });

  const { data: page } = useSuspenseQuery(getPageQueryOptions({ pageId }));

  return (
    <div>
      {page.regions?.map((region) => {
        return <Region key={region.id} region={region} />;
      })}
    </div>
  );
}
