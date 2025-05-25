import { getCategory } from "@/integrations/salesforce/server/search";
import { queryOptions } from "@tanstack/react-query";

import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

export const getCategoryQueryOptions = (params: {
  id: string;
  levels?: number;
}) => {
  return queryOptions<ShopperProductsTypes.Category>({
    queryKey: ["category", params],
    queryFn: async () => {
      return getCategory({
        data: {
          id: params.id,
          levels: params.levels,
        },
      });
    },
  });
};
