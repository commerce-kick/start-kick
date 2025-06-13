// Shared utility for consistent URL parameter handling across web and mobile
// Using web implementation as source of truth

export interface PLPSearchParams {
  offset?: number
  sort?: string
  refinements?: Record<string, string[]>
}

export interface PLPUrlParams {
  offset?: string | number
  [key: string]: string | string[] | number | undefined
  sort?: string
}

/**
 * Clean URL-encoded values that may have extra quotes
 */
function cleanUrlValue(value: string): string {
  // Remove surrounding quotes that may come from URL encoding
  return value.replace(/^["']|["']$/g, "").trim()
}

/**
 * Parse a stringified array format from mobile
 * Handles formats like: ["Beige|Black"] or ["Beige","Black"] or ["Beige", "Black"]
 */
function parseStringifiedArray(value: string): string[] {
  // Clean the value first
  const cleanValue = cleanUrlValue(value)
  
  try {
    // First, try to parse as JSON array
    const parsed = JSON.parse(cleanValue)
    if (Array.isArray(parsed)) {
      // Handle each item in the array - it might contain pipe-separated values
      const flatValues: string[] = []
      parsed.forEach((item) => {
        if (typeof item === "string") {
          // Split by pipe in case the item contains multiple values
          flatValues.push(...item.split("|").filter((v) => v.trim() !== ""))
        }
      })
      return flatValues
    }
  } catch (error) {
    console.warn("Failed to parse stringified array:", cleanValue, error)
    // If JSON parsing fails, try manual parsing
    // Remove brackets and split by comma, then clean up quotes
    const cleaned = cleanValue.replace(/^\[|\]$/g, "").trim()
    if (cleaned === "") return []

    return cleaned
      .split(",")
      .flatMap((item) => {
        // Remove quotes and trim whitespace
        const cleanItem = cleanUrlValue(item)
        // Split by pipe in case the item contains multiple values
        return cleanItem.split("|").filter((v) => v.trim() !== "")
      })
      .filter((item) => item !== "")
  }

  return []
}

/**
 * Parse URL parameters into structured search params
 * Handles both web (TanStack Router) and mobile (Expo Router) formats
 * Supports pipe-separated values and stringified arrays
 */
export function parseUrlParams(params: PLPUrlParams): PLPSearchParams {
  // Handle offset with potential quotes from URL encoding
  let offset = 0
  if (params.offset !== undefined) {
    let offsetValue = params.offset
    if (typeof offsetValue === "string") {
      // Remove quotes if they exist from URL encoding
      offsetValue = offsetValue.replace(/^["']|["']$/g, "")
    }
    const parsedOffset = typeof offsetValue === "number" ? offsetValue : Number(offsetValue)
    offset = isNaN(parsedOffset) ? 0 : parsedOffset
  }

  const sort = params.sort as string | undefined
  const refinements: Record<string, string[]> = {}

  // Extract refinements from params (everything except offset and sort)
  Object.entries(params).forEach(([key, value]) => {
    if (key !== "offset" && key !== "sort" && key !== "id" && key !== "categoryId") {
      if (Array.isArray(value)) {
        // Web format: arrays that may contain pipe-separated values
        const flatValues: string[] = []
        value.forEach((v) => {
          if (typeof v === "string") {
            // Check if it's a stringified array format
            if (v.startsWith("[") && v.endsWith("]")) {
              flatValues.push(...parseStringifiedArray(v))
            } else {
              // Split by pipe and add all values
              flatValues.push(...v.split("|").filter((val) => val.trim() !== ""))
            }
          }
        })
        if (flatValues.length > 0) {
          refinements[key] = flatValues
        }
      } else if (typeof value === "string" && value.trim() !== "") {
        // Mobile format: could be pipe-separated strings or stringified arrays
        let values: string[] = []

        if (value.startsWith("[") && value.endsWith("]")) {
          // Handle stringified array format: ["Beige|Black"] or ["Beige","Black"]
          values = parseStringifiedArray(value)
        } else {
          // Handle pipe-separated format: beige|black
          values = value.split("|").filter((v) => v.trim() !== "")
        }

        if (values.length > 0) {
          refinements[key] = values
        }
      }
    }
  })

  return { offset, sort, refinements }
}

/**
 * Serialize search params back to URL format
 * Standardized on web format (pipe-separated values)
 */
export function serializeSearchParams(
  params: PLPSearchParams,
  platform: "web" | "mobile" = "web",
): Record<string, any> {
  const result: Record<string, any> = {}

  // Add offset if not 0
  if (params.offset && params.offset !== 0) {
    result.offset = params.offset.toString()
  }

  // Add sort if exists
  if (params.sort) {
    result.sort = params.sort
  }

  // Add refinements using pipe separation for both platforms
  if (params.refinements && Object.keys(params.refinements).length > 0) {
    Object.entries(params.refinements).forEach(([key, values]) => {
      if (values.length > 0) {
        if (platform === "mobile") {
          // Mobile: single pipe-separated string (matching web format)
          result[key] = values.join("|")
        } else {
          // Web: array with single pipe-separated string for TanStack Router
          result[key] = [values.join("|")]
        }
      }
    })
  }

  return result
}

/**
 * Build API refine array from search params
 * Uses pipe separation as expected by the API
 */
export function buildRefineArray(categoryId: string, refinements: Record<string, string[]>): string[] {
  const refineArray = [`cgid=${categoryId}`]

  Object.entries(refinements).forEach(([attributeId, values]) => {
    if (values.length > 0) {
      // Join multiple values with pipe separator for API
      const joinedValues = values.join("|")
      refineArray.push(`${attributeId}=${joinedValues}`)
    }
  })

  return refineArray
}

/**
 * Debug helper to log URL parameter parsing
 */
export function debugUrlParams(params: PLPUrlParams, platform: "web" | "mobile" = "mobile"): void {
  console.log(`[${platform.toUpperCase()}] Raw params:`, params)
  const parsed = parseUrlParams(params)
  console.log(`[${platform.toUpperCase()}] Parsed params:`, parsed)

  const categoryId = (params.id as string) || (params.categoryId as string)
  if (categoryId) {
    const refineArray = buildRefineArray(categoryId, parsed.refinements || {})
    console.log(`[${platform.toUpperCase()}] API refine array:`, refineArray)
  }
}

/**
 * Helper to convert refinements to display format
 * Useful for debugging and logging
 */
export function refinementsToString(refinements: Record<string, string[]>): string {
  return Object.entries(refinements)
    .map(([key, values]) => `${key}=${values.join("|")}`)
    .join("&")
}
