import {
  getProduct,
  getCategory as getServerCategory,
  getProducts as getServerProducts,
  productSearchParamsSchema,
} from "@/integrations/salesforce/server/products";
import { tool } from "ai";
import { z } from "zod";

// Return type: ShopperSearchTypes.ProductSearchResult
const getProducts = tool({
  description: `Search for products in the catalog. Returns a ProductSearchResult containing:
  - hits: array of products with basic info (id, name, price, images)
  - total: total number of matching products
  - refinements: IMPORTANT - available filters for further refinement including:
    * Categories (cgid): Use format "cgid=categoryId"  
    * Colors (c_colorCode or c_color): Use format "c_colorCode=red"
    * Sizes (c_size): Use format "c_size=M"
    * Brands (brand): Use format "brand=BrandName"
    * Price ranges (price): Use format "price=(0..100)"
  - searchPhraseSuggestions: suggested search terms
  
  IMPORTANT: Always examine the refinements in the response to understand what filters are available for the current search. Use these exact refinement IDs and values for subsequent searches.`,
  parameters: productSearchParamsSchema,
  execute: async (parameters) => {
    console.log("getProducts tool called with parameters:", JSON.stringify(parameters, null, 2));
    try {
      const result = await getServerProducts({ data: parameters });
      console.log("getProducts result:", {
        hitCount: result.hits?.length || 0,
        total: result.total || 0,
        hasRefinements: (result.refinements?.length || 0) > 0,
        refinementTypes: result.refinements?.map(r => r.attributeId || r.label).join(', ') || 'none'
      });
      return result;
    } catch (error) {
      console.error("Error in getProducts tool:", error);
      throw error;
    }
  },
});

// Return type: ShopperProductsTypes.Product
const recommendProduct = tool({
  description: `Get detailed information about a specific product. Returns a Product object containing:
  - Basic info: id, name, shortDescription, longDescription
  - Pricing: price object with currency and formatted values
  - Media: images array with different sizes and views
  - Variants: available options (colors, sizes, etc.)
  - Inventory: stock levels and availability
  - Brand: manufacturer/brand information
  - Categories: product categorization
  Use this when you want to show detailed product information or recommend a specific item.`,
  parameters: z.object({
    id: z.string().describe("The product ID to get detailed information for"),
  }),
  execute: async ({ id }) => {
    console.log("recommendProduct tool called with id:", id);
    try {
      const result = await getProduct({ data: { id } });
      console.log("recommendProduct result:", {
        productFound: !!result,
        productName: result?.name || "N/A",
        hasImages: (result?.images?.length || 0) > 0,
        hasVariants: (result?.variants?.length || 0) > 0
      });
      return result;
    } catch (error) {
      console.error("Error in recommendProduct tool:", error);
      throw error;
    }
  },
});

// Return type: ShopperProductsTypes.Category
const getCategory = tool({
  description: `Get category information and structure. CRITICAL: Use id="root" to get the complete site category structure first.
  
  Returns a Category object containing:
  - Basic info: id, name, description
  - Hierarchy: parentCategoryId for navigation
  - Subcategories: nested categories array with their exact IDs for search
  
  USAGE PATTERNS:
  1. getCategory(id="root", levels=2) - Get complete site structure (START HERE for any product search)
  2. getCategory(id="specific-category-id") - Get details for a specific category
  
  The category IDs returned here are what you use in getProducts refinements: ["cgid=categoryId"]
  
  IMPORTANT: Always start with "root" to understand available categories before searching products.`,
  parameters: z.object({
    id: z.string().describe("The category ID to retrieve - use 'root' to get top-level categories and site structure"),
    levels: z.number().optional().describe("Number of subcategory levels to retrieve (default: 2, recommended for root)"),
  }),
  execute: async ({ id, levels = 2 }) => {
    console.log("getCategory tool called with id:", id, "levels:", levels);
    try {
      const result = await getServerCategory({ data: { id, levels } });
      console.log("getCategory result:", {
        categoryFound: !!result,
        categoryName: result?.name || "N/A",
        subcategoryCount: result?.categories?.length || 0,
        isRoot: id === "root"
      });
      return result;
    } catch (error) {
      console.error("Error in getCategory tool:", error);
      throw error;
    }
  },
});

export default async function getTools() {
  console.log("getTools function called");
  try {
    console.log("Returning tools: getProducts, recommendProduct, getCategory");
    return {
      getProducts,
      recommendProduct,
      getCategory,
    };
  } catch (error) {
    console.error("Error in getTools function:", error);
    throw error;
  }
}