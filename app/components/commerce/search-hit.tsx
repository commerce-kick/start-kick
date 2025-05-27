/* I just ask to v0 to enhace the ui, it does all the refinaments logic */

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
import type { ShopperSearchTypes } from "commerce-sdk-isomorphic";
import {
  ArrowRight,
  Eye,
  Heart,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: ShopperSearchTypes.ProductSearchHit;
  viewMode?: "grid" | "list";
}

export default function SearchHit({
  product: {
    productId,
    productName,
    image,
    price,
    priceMax,
    currency = "USD",
    orderable = true,
    productPromotions,
    imageGroups,
    priceRanges,
    representedProduct,
  },
  viewMode = "grid",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get the primary image with fallback
  const primaryImage = !imageError
    ? image?.link || imageGroups?.[0]?.images?.[0]?.link
    : null;
  const imageAlt = image?.alt || productName || "Product image";

  // Format price display
  const formatPrice = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Get price range if available
  const priceRange = priceRanges?.[0];
  const displayPrice = price || priceRange?.minPrice;
  const displayMaxPrice = priceMax || priceRange?.maxPrice;

  // Get promotion info
  const promotion = productPromotions?.[0];
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

  // Mock rating (in real app, this would come from the API)
  const rating = 4.2;
  const reviewCount = Math.floor(Math.random() * 500) + 10;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view modal
    console.log("Quick view for product:", productId);
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden border py-0 transition-all duration-300 hover:shadow-lg">
        <div className="flex">
          {/* Image Section */}
          <div className="relative h-64 w-64 flex-shrink-0">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={primaryImage || "/placeholder.svg?height=200&width=200"}
                alt={imageAlt}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
              {!orderable && (
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
                <h3 className="text-lg leading-tight font-semibold">
                  {productName || `Product ${productId}`}
                </h3>
                <div className="ml-4 flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={handleQuickView}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Quick View</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

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

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>

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
                disabled={!orderable}
                size="lg"
                asChild
              >
                <Link to="/products/$productId" params={{ productId }}>
                  {orderable ? (
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
    <Card className="group flex h-full flex-col overflow-hidden border-0 pt-0 shadow-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={primaryImage || "/placeholder.svg?height=300&width=300"}
            alt={imageAlt}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                    className="h-8 w-8 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
                    onClick={handleQuickView}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Quick View</TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
          {!orderable && (
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
        {/* Product name */}
        <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
          {productName || `Product ${productId}`}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-xs">({reviewCount})</span>
        </div>

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
          disabled={!orderable}
          size="sm"
          asChild
        >
          <Link to="/products/$productId" params={{ productId }}>
            {orderable ? (
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
