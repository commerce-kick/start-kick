import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Link } from "@tanstack/react-router";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: ShopperSearchTypes.ProductSearchHit;
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
  },
}: ProductCardProps) {
  // Get the primary image
  const primaryImage =
    image?.link || imageGroups?.[0]?.images?.[0]?.link || "/placeholder.svg";
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

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 pt-0">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={primaryImage || "/placeholder.svg"}
            alt={imageAlt}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Promotion badge */}
          {promotion?.calloutMsg && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3 text-xs font-medium"
            >
              {promotion.calloutMsg}
            </Badge>
          )}

          {/* Wishlist button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>

          {/* Stock status */}
          {!orderable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 flex-1">
        {/* Product name */}
        <h3 className="font-semibold text-sm">
          {productName || `Product ${productId}`}
        </h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {promotion?.promotionalPrice ? (
            <>
              <span className="font-bold text-lg text-red-600">
                {formatPrice(promotion.promotionalPrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(displayPrice)}
              </span>
            </>
          ) : displayMaxPrice && displayMaxPrice !== displayPrice ? (
            <span className="font-bold text-lg">
              {formatPrice(displayPrice)} - {formatPrice(displayMaxPrice)}
            </span>
          ) : (
            <span className="font-bold text-lg">
              {formatPrice(displayPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" disabled={!orderable} size="sm" asChild>
          <Link to="/products/$productId" params={{ productId }}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {orderable ? "Add to Cart" : "Out of Stock"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
