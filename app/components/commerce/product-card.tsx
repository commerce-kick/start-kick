import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "@/components/ui/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type {
  ShopperProductsTypes,
  ShopperSearchTypes,
} from "commerce-sdk-isomorphic";
import {
  ArrowRight,
  Heart,
  Shield,
  ShoppingCart,
  Truck,
  Zap
} from "lucide-react";
import { useState } from "react";

// Union type for both product types
type ProductLike =
  | ShopperSearchTypes.ProductSearchHit
  | ShopperProductsTypes.Product;

// Normalized product interface that handles differences between the two types
interface NormalizedProduct {
  id: string;
  name: string;
  image?: string;
  imageAlt?: string;
  price?: number;
  priceMax?: number;
  currency: string;
  orderable: boolean;
  promotions?: Array<any>;
  imageGroups?: Array<any>;
  priceRanges?: Array<any>;
  brand?: string;
  shortDescription?: string;
  longDescription?: string;
}

// Utility function to normalize product data
function normalizeProduct(product: ProductLike): NormalizedProduct {
  // Type guards to check which type we're dealing with
  const isSearchHit = "productId" in product;

  if (isSearchHit) {
    const searchHit = product as ShopperSearchTypes.ProductSearchHit;
    return {
      id: searchHit.productId,
      name: searchHit.productName || `Product ${searchHit.productId}`,
      image:
        searchHit.image?.link || searchHit.imageGroups?.[0]?.images?.[0]?.link,
      imageAlt: searchHit.image?.alt || searchHit.productName,
      price: searchHit.price,
      priceMax: searchHit.priceMax,
      currency: searchHit.currency || "USD",
      orderable: searchHit.orderable ?? true,
      promotions: searchHit.productPromotions,
      imageGroups: searchHit.imageGroups,
      priceRanges: searchHit.priceRanges,
    };
  } else {
    const productData = product as ShopperProductsTypes.Product;
    return {
      id: productData.id,
      name: productData.name || `Product ${productData.id}`,
      image: productData.imageGroups?.[0]?.images?.[0]?.link,
      imageAlt: productData.name,
      price: productData.price,
      priceMax: productData.priceMax,
      currency: productData.currency || "USD",
      orderable: true, // Products are generally orderable unless specified
      promotions: productData.productPromotions,
      imageGroups: productData.imageGroups,
      priceRanges: productData.priceRanges,
      brand: productData.brand,
      shortDescription: productData.shortDescription,
      longDescription: productData.longDescription,
    };
  }
}

interface ProductCardProps {
  product: ProductLike;
  viewMode?: "grid" | "list";
  onWishListToggle?: (productId: string) => void;
  isFavorite?: boolean;
  showBrand?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  viewMode = "grid",
  onWishListToggle,
  isFavorite = false,
  showBrand = false,
  showDescription = false,
  className,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(isFavorite);
  const [imageError, setImageError] = useState(false);

  // Normalize the product data
  const normalizedProduct = normalizeProduct(product);

  // Get the primary image with fallback
  const primaryImage = !imageError ? normalizedProduct.image : null;
  const imageAlt =
    normalizedProduct.imageAlt || normalizedProduct.name || "Product image";

  // Format price display
  const formatPrice = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedProduct.currency,
    }).format(amount);
  };

  // Get price range if available
  const priceRange = normalizedProduct.priceRanges?.[0];
  const displayPrice = normalizedProduct.price || priceRange?.minPrice;
  const displayMaxPrice = normalizedProduct.priceMax || priceRange?.maxPrice;

  // Get promotion info
  const promotion = normalizedProduct.promotions?.[0];
  const hasPromotion =
    promotion?.promotionalPrice &&
    promotion.promotionalPrice < (displayPrice || 0);

  // Calculate discount percentage
  const discountPercentage =
    hasPromotion && displayPrice
      ? Math.round(
          ((displayPrice - promotion.promotionalPrice!) / displayPrice) * 100,
        )
      : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onWishListToggle?.(normalizedProduct.id);
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "group overflow-hidden border py-0 transition-all duration-300 hover:shadow-md",
          className,
        )}
      >
        <div className="flex">
          {/* Image Section */}
          <div className="relative h-64 w-64 flex-shrink-0">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={primaryImage || "/placeholder.svg?height=200&width=200"}
                alt={imageAlt}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
              />

              {/* Promotion badge */}
              {hasPromotion && discountPercentage > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-2 left-2 text-xs font-medium"
                >
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Stock status overlay */}
              {!normalizedProduct.orderable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Badge variant="secondary" className="text-sm">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="space-y-3">
              {/* Product name and quick actions */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg leading-tight font-semibold">
                    {normalizedProduct.name}
                  </h3>
                  {showBrand && normalizedProduct.brand && (
                    <p className="text-muted-foreground text-sm">
                      {normalizedProduct.brand}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "h-8 w-8 opacity-0 transition-all group-hover:opacity-100",
                            isWishlisted && "text-red-500 opacity-100",
                          )}
                          onClick={handleWishlistToggle}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isWishlisted && "fill-current",
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Description */}
              {showDescription && normalizedProduct.shortDescription && (
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {normalizedProduct.shortDescription}
                </p>
              )}

              {/* Features */}
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>2-year warranty</span>
                </div>
                {hasPromotion && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Zap className="h-4 w-4" />
                    <span>Limited offer</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                {hasPromotion ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">
                      {formatPrice(promotion.promotionalPrice)}
                    </span>
                    <span className="text-muted-foreground text-lg line-through">
                      {formatPrice(displayPrice)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      Save{" "}
                      {formatPrice(
                        (displayPrice || 0) - (promotion.promotionalPrice || 0),
                      )}
                    </Badge>
                  </>
                ) : displayMaxPrice && displayMaxPrice !== displayPrice ? (
                  <span className="text-2xl font-bold">
                    {formatPrice(displayPrice)} - {formatPrice(displayMaxPrice)}
                  </span>
                ) : (
                  <span className="text-2xl font-bold">
                    {formatPrice(displayPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              <Button
                className="w-full sm:w-auto"
                disabled={!normalizedProduct.orderable}
                size="lg"
                asChild
              >
                <Link
                  to="/products/$productId"
                  params={{ productId: normalizedProduct.id }}
                >
                  {normalizedProduct.orderable ? (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-0 pt-0 shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={primaryImage || "/placeholder.svg?height=300&width=300"}
            alt={imageAlt}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />

          {/* Promotion badge */}
          {hasPromotion && discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3 z-10 text-xs font-medium"
            >
              -{discountPercentage}%
            </Badge>
          )}

          {/* Quick actions overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className={cn(
                      "h-8 w-8 bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white",
                      isWishlisted && "bg-red-50 text-red-600 hover:bg-red-100",
                    )}
                    onClick={handleWishlistToggle}
                  >
                    <Heart
                      className={cn("h-4 w-4", isWishlisted && "fill-current")}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Stock status overlay */}
          {!normalizedProduct.orderable && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Limited offer indicator */}
          {hasPromotion && (
            <div className="absolute right-3 bottom-3 left-3">
              <div className="flex w-fit items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                <Zap className="h-3 w-3" />
                <span>Limited Offer</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3">
        {/* Product name and brand */}
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
            {normalizedProduct.name}
          </h3>
          {showBrand && normalizedProduct.brand && (
            <p className="text-muted-foreground text-xs">
              {normalizedProduct.brand}
            </p>
          )}
        </div>

        {/* Description */}
        {showDescription && normalizedProduct.shortDescription && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {normalizedProduct.shortDescription}
          </p>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            <Truck className="mr-1 h-3 w-3" />
            Free Ship
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Warranty
          </Badge>
        </div>

        {/* Price */}
        <div className="mt-auto flex flex-col gap-1">
          {hasPromotion ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(promotion.promotionalPrice)}
                </span>
                <span className="text-muted-foreground text-sm line-through">
                  {formatPrice(displayPrice)}
                </span>
              </div>
              <Badge variant="destructive" className="w-fit text-xs">
                Save{" "}
                {formatPrice(
                  (displayPrice || 0) - (promotion.promotionalPrice || 0),
                )}
              </Badge>
            </>
          ) : displayMaxPrice && displayMaxPrice !== displayPrice ? (
            <span className="text-lg font-bold">
              {formatPrice(displayPrice)} - {formatPrice(displayMaxPrice)}
            </span>
          ) : (
            <span className="text-lg font-bold">
              {formatPrice(displayPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="group/btn w-full"
          disabled={!normalizedProduct.orderable}
          size="sm"
          asChild
        >
          <Link
            to="/products/$productId"
            params={{ productId: normalizedProduct.id }}
          >
            {normalizedProduct.orderable ? (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Product
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </>
            ) : (
              "Out of Stock"
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
