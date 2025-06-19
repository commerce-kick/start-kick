import type React from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Heart, ShoppingCart } from "lucide-react"
import { Suspense, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductQueryOptions } from "@/integrations/salesforce/options/products"
import { cn } from "@/lib/utils"

interface MiniProductCardProps {
  productId: string
  className?: string
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isFavorite?: boolean
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-3 space-y-2">
        <Skeleton className="h-24 w-full rounded" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </Card>
  )
}

function ProductCardError({ productId }: { productId: string }) {
  return (
    <Card className="overflow-hidden border-red-200">
      <div className="p-3 text-center">
        <div className="text-xs text-red-600">Product unavailable</div>
        <div className="text-xs text-gray-500 mt-1">ID: {productId}</div>
      </div>
    </Card>
  )
}

function ProductCardContent({
  product,
  onAddToCart,
  onToggleWishlist,
  isFavorite,
}: {
  product: any
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isFavorite?: boolean
}) {
  // Get the primary image from imageGroups
  const primaryImage =
    product.imageGroups?.find((group: any) => group.viewType === "large" || group.viewType === "medium")?.images?.[0]
      ?.link || product.imageGroups?.[0]?.images?.[0]?.link

  // Format price - handle different price structures
  const formatPrice = () => {
    if (product.price) {
      return `$${product.price.toFixed(2)}`
    }
    if (product.prices?.USD) {
      return `$${product.prices.USD.toFixed(2)}`
    }
    if (product.priceRanges?.[0]) {
      const range = product.priceRanges[0]
      if (range.minPrice === range.maxPrice) {
        return `$${range.minPrice.toFixed(2)}`
      }
      return `$${range.minPrice.toFixed(2)} - $${range.maxPrice.toFixed(2)}`
    }
    return "Price unavailable"
  }

  // Check if product is orderable
  const isOrderable = product.inventory?.orderable !== false

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage || "/placeholder.svg"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}
        </div>

        {/* Wishlist button */}
        {onToggleWishlist && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => onToggleWishlist(product.id)}
          >
            <Heart className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </Button>
        )}

        {/* Stock indicator */}
        {!isOrderable && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</div>
        )}
      </div>

      <div className="p-3 space-y-2">
        {/* Brand */}
        {product.brand && <div className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</div>}

        {/* Product Name */}
        <h3 className="font-medium text-sm line-clamp-2 leading-tight">{product.name || "Unnamed Product"}</h3>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.shortDescription.replace(/<[^>]*>/g, "")} {/* Strip HTML */}
          </p>
        )}

        {/* Price */}
        <div className="font-semibold text-green-600">{formatPrice()}</div>

        {/* Variants indicator */}
        {product.variants && product.variants.length > 0 && (
          <div className="text-xs text-gray-500">
            {product.variants.length} variant{product.variants.length > 1 ? "s" : ""} available
          </div>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <Button size="sm" className="w-full mt-2" disabled={!isOrderable} onClick={() => onAddToCart(product.id)}>
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isOrderable ? "Add to Cart" : "Unavailable"}
          </Button>
        )}
      </div>
    </Card>
  )
}

export function MiniProductCard({
  productId,
  className,
  onAddToCart,
  onToggleWishlist,
  isFavorite,
}: MiniProductCardProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <ProductCardError productId={productId} />
  }

  return (
    <div className={cn("w-full", className)}>
      <ErrorBoundary onError={() => setHasError(true)}>
        <ProductCardWithQuery
          productId={productId}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isFavorite={isFavorite}
        />
      </ErrorBoundary>
    </div>
  )
}

function ProductCardWithQuery({
  productId,
  onAddToCart,
  onToggleWishlist,
  isFavorite,
}: {
  productId: string
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isFavorite?: boolean
}) {
  const { data: product } = useSuspenseQuery(getProductQueryOptions({ id: productId }))

  return (
    <ProductCardContent
      product={product}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      isFavorite={isFavorite}
    />
  )
}

// Simple error boundary component
function ErrorBoundary({
  children,
  onError,
}: {
  children: React.ReactNode
  onError: () => void
}) {
  try {
    return <>{children}</>
  } catch (error) {
    onError()
    return null
  }
}

// Suspense wrapper for the AI assistant
export function MiniProductCardWithSuspense(props: MiniProductCardProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <MiniProductCard {...props} />
    </Suspense>
  )
}
