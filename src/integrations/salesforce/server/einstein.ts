import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

const config = {
  siteId: process.env.EINSTEIN_SITE,
  host: process.env.EINSTEIN_HOST,
  id: process.env.EINSTEIN_ID,
};

const instace = axios.create({
  baseURL: config.host,
  headers: {
    "x-cq-client-id": config.id,
  },
});

export const getProductRecs = createServerFn({ method: "POST" })
  .inputValidator((data: { recId: string; products: { id: string }[] }) => data)
  .handler(async ({ data }) => {
    const { data: response } = await instace.post(
      `/v3/personalization/recs/${config.siteId}/${data.recId}`,
      {
        products: data.products,
      },
    );

    return response;
  });
