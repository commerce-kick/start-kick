/**
 * Configuration options for DIS URL manipulation
 */
export interface DISConfig {
  w?: number; // Width in pixels
  h?: number; // Height in pixels
}

/**
 * Applies width and height parameters to a DIS URL
 * @param url Base DIS URL
 * @param config Configuration object with optional width and height
 * @returns Modified URL with applied parameters
 */
export function applyDISConfig(url: string, config: DISConfig): string {
  if (!url) return url;

  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // Apply width parameter
    if (config.w !== undefined) {
      params.set("sw", config.w.toString());
    }

    // Apply height parameter
    if (config.h !== undefined) {
      params.set("sh", config.h.toString());
    }

    return urlObj.toString();
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
}

/**
 * React hook to manipulate DIS URLs with memoization
 * @param url Base DIS URL
 * @param config Configuration object with optional width and height
 * @returns Modified URL with applied parameters
 *
 * @example
 * const imageUrl = useDIS('https://example.com/image.jpg', { w: 800, h: 600 });
 */
export function useDIS(url: string | undefined, config: DISConfig): string {
  if (!url) return "";

  return applyDISConfig(url, config);
}

/**
 * React hook to create a DIS URL transformer function
 * Useful when you need to transform multiple URLs with the same config
 *
 * @param config Configuration object with optional width and height
 * @returns Function that transforms a URL with the given config
 *
 * @example
 * const transformUrl = useDISTransform({ w: 800, h: 600 });
 * const url1 = transformUrl('https://example.com/image1.jpg');
 * const url2 = transformUrl('https://example.com/image2.jpg');
 */
export function useDISTransform(config: DISConfig) {
  return (url: string) => applyDISConfig(url, config);
}
