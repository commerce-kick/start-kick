import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

const config = {
  siteId: process.env.VITE_EINSTEIN_SITE,
  host: process.env.VITE_EINSTEIN_HOST,
  id: process.env.VITE_EINSTEIN_ID,
};

const instace = axios.create({
  baseURL: config.host,
  headers: {
    "x-cq-client-id": config.id,
  },
});

export const getProductRecs = createServerFn({ method: "POST" })
  .validator((data: { recId: string; products: { id: string }[] }) => data)
  .handler(async ({ data }) => {
    const { data: response } = await instace.post(
      `/v3/personalization/recs/${config.siteId}/${data.recId}`,
      {
        products: data.products,
      },
    );

    return response;
  });
