import { getSearchSuggestions } from "@/integrations/salesforce/server/search";
import { SearchSuggestionsParams } from "@/integrations/salesforce/types";
import { queryOptions } from "@tanstack/react-query";

export const getSearchSuggestionsOptions = (
  params: SearchSuggestionsParams,
) => {
  return queryOptions({
    queryKey: ["searchSuggestions", { ...params }],
    queryFn: async () => {
      return getSearchSuggestions({
        data: params,
      });
    },
    enabled: params.q.length >= 3,
  });
};
