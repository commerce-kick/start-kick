import Price from "@/components/commerce/price";
import { ProductImageGallery } from "@/components/commerce/product-image-gallery";
import { ProductRecommendations } from "@/components/commerce/product-recommendations";
import { ProductVariations } from "@/components/commerce/product-variations";
import Rating from "@/components/commerce/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProductQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";
import {
  ArrowLeft,
  Heart,
  Info,
  Minus,
  Plus,
  Share2,
  Truck,
} from "lucide-react";
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

  const { data: product, isLoading } = useSuspenseQuery<ShopperProductsTypes.Product>(
    getProductQueryOptions({ productId })
  );
  
  const { minOrderQuantity = 1, stepQuantity = 1 } = product;

  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});

  const isInStock =
    product.inventory?.orderable !== false &&
    product.inventory?.stockLevel !== 0;
  const stockLevel = product.inventory?.stockLevel;
  const promotion = product.productPromotions?.[0];

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
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Back button and breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}

        <div className="w-full rounded-xl overflow-hidden bg-muted/30 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <div className="bg-background p-4 rounded-lg shadow-lg flex items-center gap-2">
                <LoadingIndicator />
                <span>Updating product...</span>
              </div>
            </div>
          )}
          {product.imageGroups ? (
            <ProductImageGallery imageGroups={product.imageGroups} />
          ) : (
            <div className="aspect-square bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rating rating={4} />
                <span className="text-sm text-muted-foreground">
                  (24 reviews)
                </span>
              </div>
              <div className="flex gap-4 items-center">
                {isLoading && <LoadingIndicator />}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {product.productName}
            </h1>

            <Price
              price={product.price}
              currency={product.currency}
              priceMax={product.priceMax}
              unit={product.unit}
              promotion={promotion}
            />

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Item No. {product.id}
              </p>
              {product.uuid && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">UUID: {product.uuid}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            {product.variationAttributes &&
              product.variationAttributes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Options</h3>
                  <ProductVariations
                    variationAttributes={product.variationAttributes}
                    onVariationChange={setSelectedVariations}
                  />
                </div>
              )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Quantity</h3>
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
              </div>

              {/* Quantity and Add to Cart */}
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
            </div>

            <div className="flex sm:flex-row gap-3">
              <Button size="lg" className="flex-1" onClick={() => {}}>
                {/* {addToCart.isPending ? (
                  <LoadingIndicator />
                ) : (
                  <ShoppingBag className="mr-2 h-5 w-5" />
                )} */}
                <span className="ml-2">Add to Cart</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="lg" className="flex-none">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Free shipping</p>
                <p className="text-xs text-muted-foreground">
                  Delivery in 2-4 business days
                </p>
              </div>
            </div>

            {product.shortDescription && (
              <div className="text-sm text-muted-foreground">
                <p>{product.shortDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {product.longDescription ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.longDescription,
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      No description available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Material</p>
                    <p className="text-sm text-muted-foreground">
                      Premium cotton blend
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">0.5 kg</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dimensions</p>
                    <p className="text-sm text-muted-foreground">
                      10 × 5 × 2 cm
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Care Instructions</p>
                    <p className="text-sm text-muted-foreground">
                      Machine wash cold
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProductRecommendations
        recommendations={product.recommendations}
        currency={product.currency}
      />
    </div>
  );
}
