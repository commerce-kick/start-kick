import {
  getCategory,
  getProducts,
} from "@/integrations/salesforce/server/products";
import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// Step 1: Define the tool schema
const getCategoriesDef = toolDefinition({
  name: "get_categories",
  description: "Get the list of the site categories, you can find product with this",
  inputSchema: z.object({
    id: z.string().describe("The category id, use root as default"),
    level: z
      .number()
      .describe("category deeps, how many child categories will get, max 2"),
  }),
  outputSchema: z.object({
    categories: z.array(z.object({ id: z.string() })).optional(),
    id: z.string().optional(),
  }),
});

const getProductsDef = toolDefinition({
  name: "get_products",
  description: "call the root categories first to refine by category, then search product with filters",
  inputSchema: z.object({
    q: z.string().optional().describe("red t shirt"),
    refine: z
      .array(z.string())
      .optional()
      .describe("refine params [cgid=$category, c_color=$red]"),
  }),
  outputSchema: z.object({
    hits: z
      .array(
        z.object({
          productName: z.string(),
          price: z.number().optional(),
          productId: z.string(),
          image: z.object({ disBaseLink: z.string().optional() }).optional(),
        }),
      )
      .optional(),
  }),
});

// Step 2: Create a server implementation
export const getCategoriesServer = getCategoriesDef.server(
  async ({ id, level }) => {
    const response = await getCategory({ data: { id, levels: level } });
    return {
      id: response.id,
      categories: response.categories,
    };
  },
);

export const getProductsServer = getProductsDef.server(
  async ({ q, refine }) => {
    const response = await getProducts({ data: { q, refine } });
    return {
      hits: response.hits,
    };
  },
);
