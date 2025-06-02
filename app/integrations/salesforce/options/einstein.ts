import { getProductRecs } from "@/integrations/salesforce/server/einstein";
import { queryOptions } from "@tanstack/react-query";

export default function getProductRecsQueryOptions(params: {
  recId: string;
  products: { id: string }[];
}) {
  return queryOptions({
    queryKey: ["recs", { ...params }],
    queryFn: async () => getProductRecs({ data: params }),
  });
}
