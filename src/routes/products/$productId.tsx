import Price from "@/components/commerce/price";
import { ProductImageGallery } from "@/components/commerce/product-image-gallery";
import { ProductRecommendations } from "@/components/commerce/product-recommendations";
import { ProductVariations } from "@/components/commerce/product-variations";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAddItemToBasketMutation } from "@/integrations/salesforce/options/basket";
import { getProductQueryOptions } from "@/integrations/salesforce/options/products";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type {
  ShopperBasketsTypes,
  ShopperProductsTypes,
} from "commerce-sdk-isomorphic";
import {
  AlertCircle,
  CheckCircle,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/products/$productId")({
  component: RouteComponent,
  validateSearch: z.object({
    pid: z.string().optional(),
    variations: z.object(z.string()).optional(),
  }),
  loaderDeps: ({ search }) => ({ pid: search.pid }),
  loader: async ({ params, context, deps }) => {
    const { queryClient } = context;

    // Use pid from search params if available, otherwise use productId from params
    const productId = deps.pid || params.productId;

    await queryClient.ensureQueryData(
      getProductQueryOptions({
        id: productId,
        perPricebook: true,
        expand: [
          "availability",
          "promotions",
          "options",
          "images",
          "prices",
          "variations",
          "set_products",
          "bundled_products",
        ],
        allImages: true,
      }),
    );
  },
});

// Helper function to get default selections for variation attributes
function getDefaultSelections(variationAttributes: any[], variants: any[]) {
  const defaultSelections: Record<string, string> = {};

  variationAttributes?.forEach((attr) => {
    if (attr.values && attr.values.length > 0) {
      // Filter orderable values
      const orderableValues = attr.values.filter((value: any) => {
        // Check if any variant with this value is orderable
        return variants?.some(
          (variant) =>
            variant.variationValues?.[attr.id] === value.value &&
            variant.orderable !== false,
        );
      });

      // If only one orderable option, auto-select it
      if (orderableValues.length === 1) {
        defaultSelections[attr.id] = orderableValues[0].value;
      }
      // If multiple options, select the first orderable one as default
      else if (orderableValues.length > 1) {
        defaultSelections[attr.id] = orderableValues[0].value;
      }
    }
  });

  return defaultSelections;
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductInBundleCard = ({
  product,
}: {
  product: ShopperProductsTypes.Product;
}) => {
  const primaryImage = product.imageGroups?.find(
    (group) => group.viewType === "large",
  )?.images?.[0];

  return (
    <Card className="h-full overflow-hidden py-0 transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.link || "/placeholder.svg"}
            alt={primaryImage.alt || product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        {product.productPromotions?.[0] && (
          <Badge className="absolute top-2 left-2" variant="destructive">
            <Zap className="mr-1 h-3 w-3" />
            Sale
          </Badge>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          {product.brand && (
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          )}
          <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="space-y-1">
          <Price
            price={product.price}
            currency={product.currency}
            priceMax={product.priceMax}
            promotion={product.productPromotions?.[0]}
            className="text-lg font-bold"
          />
          {product.shortDescription && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            {product.inventory?.stockLevel !== 0 ? (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  In Stock
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-600">
                  Out of Stock
                </span>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function RouteComponent() {
  const { productId } = Route.useParams();
  const { pid, variations: urlVariations } = Route.useSearch();
  const navigate = useNavigate({ from: "/products/$productId" });

  // Use pid if available, otherwise use productId
  const actualProductId = pid || productId;

  const {
    data: product,
    isLoading,
    isError,
  } = useSuspenseQuery(
    getProductQueryOptions({
      id: actualProductId,
      perPricebook: true,
      expand: [
        "availability",
        "promotions",
        "options",
        "images",
        "prices",
        "variations",
        "set_products",
        "bundled_products",
      ],
      allImages: true,
    }),
  );

  const addToBasketMutation = useAddItemToBasketMutation();

  const { minOrderQuantity = 1, stepQuantity = 1 } = product;
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Initialize default selections
  useEffect(() => {
    if (product.variationAttributes && product.variants) {
      const defaultSelections = getDefaultSelections(
        product.variationAttributes,
        product.variants,
      );

      // Merge URL variations with defaults (URL takes precedence)
      const initialSelections = {
        ...defaultSelections,
        ...(urlVariations || {}),
      };

      setSelectedVariations(initialSelections);

      // Find the variant for initial selections
      const initialVariant = product.variants?.find((variant) => {
        return Object.entries(initialSelections).every(([attrId, value]) => {
          return variant.variationValues?.[attrId] === value;
        });
      });

      // Update URL if we have default selections and no URL variations
      if (Object.keys(initialSelections).length > 0 && !urlVariations) {
        navigate({
          search: (prev) => ({
            ...prev,
            variations: initialSelections,
            pid: initialVariant?.productId || undefined,
          }),
          replace: true,
        });
      }
    }
  }, [product.variationAttributes, product.variants, urlVariations, navigate]);

  // Find the selected variant
  const selectedVariant = product.variants?.find((variant) => {
    return Object.entries(selectedVariations).every(([attrId, value]) => {
      return variant.variationValues?.[attrId] === value;
    });
  });

  const isInStock =
    selectedVariant?.orderable !== false &&
    selectedVariant?.inventory?.stockLevel !== 0;
  const stockLevel =
    selectedVariant?.inventory?.stockLevel || product.inventory?.stockLevel;
  const promotion = product.productPromotions?.[0];

  // Calculate stock status
  const getStockStatus = () => {
    if (!isInStock)
      return { status: "out-of-stock", color: "red", text: "Out of Stock" };
    if (stockLevel && stockLevel <= 5)
      return {
        status: "low-stock",
        color: "orange",
        text: `Only ${stockLevel} left`,
      };
    if (stockLevel && stockLevel <= 20)
      return { status: "limited", color: "yellow", text: "Limited Stock" };
    return { status: "in-stock", color: "green", text: "In Stock" };
  };

  const stockStatus = getStockStatus();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(minOrderQuantity, quantity + delta);
    if (stepQuantity > 1) {
      const remainder = (newQuantity - minOrderQuantity) % stepQuantity;
      setQuantity(
        remainder === 0 ? newQuantity : newQuantity - remainder + stepQuantity,
      );
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleVariationChange = (newVariations: Record<string, string>) => {
    setSelectedVariations(newVariations);

    // Find the selected variant based on new variations
    const newSelectedVariant = product.variants?.find((variant) => {
      return Object.entries(newVariations).every(([attrId, value]) => {
        return variant.variationValues?.[attrId] === value;
      });
    });

    // Update URL with new variations and PID if variant is selected
    navigate({
      search: (prev) => ({
        ...prev,
        variations:
          Object.keys(newVariations).length > 0 ? newVariations : undefined,
        pid: newSelectedVariant?.productId || undefined,
      }),
      replace: true,
    });
  };

  const handleAddToCart = async () => {
    const productSelectionValues: ShopperBasketsTypes.ProductItem[] = [
      {
        productId: selectedVariant?.productId || product.id,
        price: selectedVariant?.price || product.price,
        quantity,
      },
    ];

    try {
      addToBasketMutation.mutate({
        body: productSelectionValues,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images with Variation Support */}
          <div className="space-y-4">
            <div className="relative">
              {promotion && (
                <Badge
                  className="absolute top-4 left-4 z-10"
                  variant="destructive"
                >
                  <Zap className="mr-1 h-3 w-3" />
                  {promotion.calloutMsg || "Special Offer"}
                </Badge>
              )}
              <ProductImageGallery
                imageGroups={product.imageGroups}
                productName={product.name}
                selectedVariationAttributes={selectedVariations}
                lazy={false}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {product.brand && (
                    <Badge variant="outline" className="w-fit">
                      {product.brand}
                    </Badge>
                  )}
                  <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                    {product.name}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isWishlisted ? "default" : "outline"}
                          size="icon"
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

              {/* Price */}
              <div className="space-y-2">
                <Price
                  price={selectedVariant?.price || product.price}
                  currency={product.currency}
                  priceMax={product.priceMax}
                  unit={product.unit}
                  promotion={promotion}
                  className="text-2xl"
                />
                {promotion && (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      Save{" "}
                      {promotion.promotionalPrice &&
                      (selectedVariant?.price || product.price)
                        ? Math.round(
                            (((selectedVariant?.price ?? product.price ?? 0) -
                              (promotion.promotionalPrice ?? 0)) /
                              (selectedVariant?.price ?? product.price ?? 1)) *
                              100,
                          )
                        : 0}
                      %
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      Limited time offer
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Product Options */}
            <div className="space-y-6">
              {/* Variations */}
              {product.variationAttributes &&
                product.variationAttributes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Options</h3>
                    <ProductVariations
                      variationAttributes={product.variationAttributes}
                      variants={product.variants}
                      selectedVariations={selectedVariations}
                      onVariationChange={handleVariationChange}
                    />
                  </div>
                )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="font-semibold">Quantity</h3>
                    {minOrderQuantity > 1 && (
                      <span className="text-muted-foreground text-sm">
                        Min. order: {minOrderQuantity}
                      </span>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      stockStatus.color === "green" &&
                        "border-green-200 bg-green-50",
                      stockStatus.color === "orange" &&
                        "border-orange-200 bg-orange-50",
                      stockStatus.color === "red" && "border-red-200 bg-red-50",
                    )}
                  >
                    {stockStatus.color === "green" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {stockStatus.color === "orange" && (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                    {stockStatus.color === "red" && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={cn(
                        stockStatus.color === "green" && "text-green-800",
                        stockStatus.color === "orange" && "text-orange-800",
                        stockStatus.color === "red" && "text-red-800",
                      )}
                    >
                      {stockStatus.text}
                    </span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-lg border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-stepQuantity)}
                      disabled={quantity <= minOrderQuantity}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[60px] px-4 py-2 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(stepQuantity)}
                      disabled={!isInStock}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {stepQuantity > 1 && (
                    <span className="text-muted-foreground text-sm">
                      Step: {stepQuantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                {/* Product Features */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="bg-muted/30 flex items-center gap-2 rounded-lg p-3">
                    <Truck className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-xs font-medium">Free Shipping</p>
                      <p className="text-muted-foreground text-xs">2-4 days</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 flex items-center gap-2 rounded-lg p-3">
                    <RotateCcw className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-xs font-medium">Easy Returns</p>
                      <p className="text-muted-foreground text-xs">30 days</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 flex items-center gap-2 rounded-lg p-3">
                    <Shield className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-xs font-medium">Warranty</p>
                      <p className="text-muted-foreground text-xs">2 years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">
                    {product.shortDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shop Products */}
        <section className="py-12 md:py-16">
          <Carousel className="mx-auto">
            <CarouselContent>
              {product.bundledProducts?.map(({ product }, index) => (
                <CarouselItem key={`product-${index}`} className="md:basis-1/4">
                  <ProductInBundleCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </section>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>

              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {product.longDescription ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.longDescription,
                        }}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        No detailed description available for this product.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {product.manufacturerName && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Manufacturer</p>
                        <p className="text-muted-foreground text-sm">
                          {product.manufacturerName}
                        </p>
                      </div>
                    )}
                    {product.manufacturerSku && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Manufacturer SKU</p>
                        <p className="text-muted-foreground text-sm">
                          {product.manufacturerSku}
                        </p>
                      </div>
                    )}
                    {product.upc && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">UPC</p>
                        <p className="text-muted-foreground text-sm">
                          {product.upc}
                        </p>
                      </div>
                    )}
                    {product.ean && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">EAN</p>
                        <p className="text-muted-foreground text-sm">
                          {product.ean}
                        </p>
                      </div>
                    )}
                    {product.unit && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Unit</p>
                        <p className="text-muted-foreground text-sm">
                          {product.unit}
                        </p>
                      </div>
                    )}
                    {product.stepQuantity && product.stepQuantity > 1 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Step Quantity</p>
                        <p className="text-muted-foreground text-sm">
                          {product.stepQuantity}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Shipping Options</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <Truck className="text-muted-foreground h-5 w-5" />
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-muted-foreground text-sm">
                                  5-7 business days
                                </p>
                              </div>
                            </div>
                            <span className="font-medium">Free</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <Zap className="text-muted-foreground h-5 w-5" />
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-muted-foreground text-sm">
                                  2-3 business days
                                </p>
                              </div>
                            </div>
                            <span className="font-medium">$9.99</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Return Policy</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <RotateCcw className="text-muted-foreground mt-0.5 h-5 w-5" />
                            <div>
                              <p className="font-medium">30-Day Returns</p>
                              <p className="text-muted-foreground text-sm">
                                Free returns within 30 days of purchase
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Shield className="text-muted-foreground mt-0.5 h-5 w-5" />
                            <div>
                              <p className="font-medium">Warranty</p>
                              <p className="text-muted-foreground text-sm">
                                2-year manufacturer warranty included
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ProductRecommendations products={[{ id: actualProductId }]} recId="pdp-similar-items" />
      </div>
    </div>
  );
}
