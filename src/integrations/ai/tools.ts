import {
  getProduct,
  getCategory as getServerCategory,
  getProducts as getServerProducts,
  productSearchParamsSchema,
} from "@/integrations/salesforce/server/products"
import { tool } from "ai"
import { z } from "zod"

// Ultra-minimal tool responses - return only IDs
const getProducts = tool({
  description: `Browse products. Use refine=["cgid=CATEGORY_ID"] + filters.`,
  parameters: productSearchParamsSchema,
  execute: async (parameters) => {
    try {
      const result = await getServerProducts({ data: parameters })

      // Return actual product hits with essential data for the UI
      return {
        total: result.total || 0,
        hits: (result.hits || []).slice(0, 3).map((product: any) => ({
          productId: product.productId,
          productName: product.productName,
          price: product.price
            ? `$${product.price}`
            : product.priceRanges?.[0]
              ? `$${product.priceRanges[0].minPrice} - $${product.priceRanges[0].maxPrice}`
              : null,
          image: product.imageGroups?.[0]?.images?.[0]?.link || null,
          brand: product.brand || null,
        })),
        // Keep color options for filtering
        colors:
          result.refinements
            ?.find((r: any) => r.attributeId?.includes("color") || r.attributeId?.includes("Color"))
            ?.values?.slice(0, 5)
            .map((v: any) => v.value) || [],
      }
    } catch (error) {
      console.error("getProducts error:", error)
      throw error
    }
  },
})

const recommendProduct = tool({
  description: `Get product details for recommendation.`,
  parameters: z.object({
    id: z.string(),
  }),
  execute: async ({ id }) => {
    try {
      const result = await getProduct({ data: { id } })

      // Return formatted product data for the UI
      return {
        productId: result.id,
        productName: result.name,
        price: result.price
          ? `$${result.price}`
          : result.priceRanges?.[0]
            ? `$${result.priceRanges[0].minPrice} - $${result.priceRanges[0].maxPrice}`
            : null,
        image: result.imageGroups?.[0]?.images?.[0]?.link || null,
        brand: result.brand || null,
      }
    } catch (error) {
      console.error("recommendProduct error:", error)
      throw error
    }
  },
})

const getCategory = tool({
  description: `Get categories. Use id="root" for all.`,
  parameters: z.object({
    id: z.string(),
    levels: z.number().optional(),
  }),
  execute: async ({ id, levels = 2 }) => {
    try {
      const result = await getServerCategory({ data: { id, levels } })

      // Return only category IDs and names
      return {
        categories: (result?.categories || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        })),
      }
    } catch (error) {
      console.error("getCategory error:", error)
      throw error
    }
  },
})

export default async function getTools() {
  return { getProducts, recommendProduct, getCategory }
}
