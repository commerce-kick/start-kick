import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

interface ProductRecommendationsProps {
  recommendations?: Array<ShopperProductsTypes.Recommendation>;
  currency?: string;
}

export function ProductRecommendations({
  recommendations,
  currency = "USD",
}: ProductRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.slice(0, 4).map((product, index) => (
          <Card
            key={product.productId || index}
            className="group cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-3 space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={
                    product.image?.link ||
                    "/placeholder.svg?height=200&width=200"
                  }
                  alt={product.image?.alt || product.name || "Product"}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {product.calloutMsg && (
                  <Badge className="absolute top-2 left-2 text-xs">
                    {product.calloutMsg}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2">
                  {product.name}
                </h3>
                {product.price && (
                  <p className="font-semibold text-sm">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <Button size="sm" className="w-full">
                View Product
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
