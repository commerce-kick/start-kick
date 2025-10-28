import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { SearchSuggestionsParams } from "@/integrations/salesforce/types/params";
import { createServerFn } from "@tanstack/react-start";

export const getSearchSuggestions = createServerFn({ method: "GET" })
  .inputValidator((data: SearchSuggestionsParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperSearch = await api.shopperSearch();
    return await shopperSearch.getSearchSuggestions({
      parameters: data,
    });
  });
