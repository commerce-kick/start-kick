import { getSalesforceAPI } from "@/integrations/salesforce/server/config";
import { GetPageParams } from "@/integrations/salesforce/types/params";
import { createServerFn } from "@tanstack/react-start";

export const getPage = createServerFn({ method: "POST" })
  .inputValidator((data: GetPageParams) => data)
  .handler(async ({ data }) => {
    const { api } = await getSalesforceAPI();
    const shopperExperience = await api.shopperExperience();

    return await shopperExperience.getPage({
      parameters: data,
    });
  });
