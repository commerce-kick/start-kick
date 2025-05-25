import { ProductImageGallery } from "@/components/commerce/product-image-gallery";
import { ProductRecommendations } from "@/components/commerce/product-recommendations";
import { ProductVariations } from "@/components/commerce/product-variations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/products/$productId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductQueryOptions({
        productId: params.productId,
      })
    );
  },
});

function RouteComponent() {
  const { productId } = Route.useParams();

  const { data: product } = useSuspenseQuery(
    getProductQueryOptions({ productId })
  );

  const {
    id,
    name,
    brand,
    manufacturerName,
    price,
    priceMax,
    currency = "USD",
    shortDescription,
    longDescription,
    imageGroups,
    variationAttributes,
    inventory,
    productPromotions,
    recommendations,
    minOrderQuantity = 1,
    stepQuantity = 1,
    unit,
    manufacturerSku,
    ean,
    upc,
  } = product;

  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});

  const formatPrice = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const isInStock =
    inventory?.orderable !== false && inventory?.stockLevel !== 0;
  const stockLevel = inventory?.stockLevel;
  const promotion = productPromotions?.[0];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(minOrderQuantity, quantity + delta);
    if (stepQuantity > 1) {
      const remainder = (newQuantity - minOrderQuantity) % stepQuantity;
      setQuantity(
        remainder === 0 ? newQuantity : newQuantity - remainder + stepQuantity
      );
    } else {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <ProductImageGallery imageGroups={imageGroups} productName={name} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Brand and Name */}
          <div className="space-y-2">
            {brand && (
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {brand}
              </p>
            )}
            <h1 className="text-3xl font-bold">{name || `Product ${id}`}</h1>
            {manufacturerName && manufacturerName !== brand && (
              <p className="text-sm text-muted-foreground">
                by {manufacturerName}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (4.2) • 127 reviews
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {promotion?.promotionalPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(promotion.promotionalPrice)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(price)}
                  </span>
                  <Badge variant="destructive">{promotion.calloutMsg}</Badge>
                </>
              ) : priceMax && priceMax !== price ? (
                <span className="text-3xl font-bold">
                  {formatPrice(price)} - {formatPrice(priceMax)}
                </span>
              ) : (
                <span className="text-3xl font-bold">{formatPrice(price)}</span>
              )}
            </div>
            {unit && (
              <p className="text-sm text-muted-foreground">Price per {unit}</p>
            )}
          </div>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-muted-foreground">{shortDescription}</p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isInStock ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-600">In Stock</span>
                {stockLevel && stockLevel < 10 && (
                  <span className="text-sm text-orange-600">
                    ({stockLevel} left)
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-600">Out of Stock</span>
              </>
            )}
          </div>

          {/* Variations */}
          <ProductVariations
            variationAttributes={variationAttributes}
            onVariationChange={setSelectedVariations}
          />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-stepQuantity)}
                  disabled={quantity <= minOrderQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(stepQuantity)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {minOrderQuantity > 1 && (
                <span className="text-sm text-muted-foreground">
                  Min. order: {minOrderQuantity}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" disabled={!isInStock} size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Free shipping on orders over $50
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {longDescription ? (
                  <div dangerouslySetInnerHTML={{ __html: longDescription }} />
                ) : (
                  <p>No detailed description available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {manufacturerSku && (
                  <div className="flex justify-between">
                    <span className="font-medium">Manufacturer SKU:</span>
                    <span>{manufacturerSku}</span>
                  </div>
                )}
                {ean && (
                  <div className="flex justify-between">
                    <span className="font-medium">EAN:</span>
                    <span>{ean}</span>
                  </div>
                )}
                {upc && (
                  <div className="flex justify-between">
                    <span className="font-medium">UPC:</span>
                    <span>{upc}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Product ID:</span>
                  <span>{id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reviews feature coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <ProductRecommendations
        recommendations={recommendations}
        currency={currency}
      />
    </div>
  );
}
