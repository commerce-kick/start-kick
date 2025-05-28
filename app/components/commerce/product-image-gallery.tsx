import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import type { ShopperProductsTypes } from "commerce-sdk-isomorphic";
import { useEffect, useMemo, useState } from "react";

interface ProductImageGalleryProps {
  imageGroups?: Array<ShopperProductsTypes.ImageGroup>;
  productName?: string;
  selectedVariationAttributes?: Record<string, string>;
  type?: "large" | "small";
  className?: string;
  lazy?: boolean;
}

// Utility function to find image group by view type and variation attributes
function findImageGroupBy(
  imageGroups: Array<ShopperProductsTypes.ImageGroup>,
  {
    viewType,
    selectedVariationAttributes = {},
  }: {
    viewType: string;
    selectedVariationAttributes?: Record<string, string>;
  },
) {
  if (!imageGroups || imageGroups.length === 0) return null;

  // First, try to find an exact match with variation attributes
  const exactMatch = imageGroups.find((group) => {
    if (group.viewType !== viewType) return false;

    // Check if this image group matches the selected variation attributes
    if (
      group.variationAttributes &&
      Object.keys(selectedVariationAttributes).length > 0
    ) {
      return Object.entries(selectedVariationAttributes).every(
        ([attrId, value]) => {
          const groupAttr = group.variationAttributes?.[attrId];
          return groupAttr === value;
        },
      );
    }

    // If no variation attributes are specified, prefer groups without variation attributes
    return (
      !group.variationAttributes ||
      Object.keys(group.variationAttributes).length === 0
    );
  });

  if (exactMatch) return exactMatch;

  // Fallback to any group with the correct view type
  return imageGroups.find((group) => group.viewType === viewType) || null;
}

export function ProductImageGallery({
  imageGroups = [],
  productName = "Product",
  selectedVariationAttributes = {},
  className,
  lazy = false,
}: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Get the hero image group for the current variation
  const heroImageGroup = useMemo(
    () =>
      findImageGroupBy(imageGroups, {
        viewType: "large",
        selectedVariationAttributes,
      }),
    [imageGroups, selectedVariationAttributes],
  );

  // Get thumbnail image group for the current variation
  const thumbnailImageGroup = useMemo(
    () =>
      findImageGroupBy(imageGroups, {
        viewType: "small",
        selectedVariationAttributes,
      }),
    [imageGroups, selectedVariationAttributes],
  );

  // Use hero images if available, otherwise fall back to thumbnail images
  const displayImageGroup = heroImageGroup || thumbnailImageGroup;
  const images = displayImageGroup?.images || [];

  const processedImages =
    images.length > 0
      ? images.map((img) => ({
          src:
            img.disBaseLink ||
            img.link ||
            "/placeholder.svg?height=600&width=600",
          alt: img.alt || productName,
          title: img.title,
        }))
      : [
          {
            src: "/placeholder.svg?height=600&width=600",
            alt: productName,
            title: productName,
          },
        ];

  // Reset carousel when variation changes
  useEffect(() => {
    setCurrent(0);
    api?.scrollTo(0);
  }, [selectedVariationAttributes, api]);

  // Update carousel state
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Carousel */}
      <Card className="bg-muted/30 group relative overflow-hidden py-0">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {processedImages.map((image, index) => (
              <CarouselItem
                key={`${JSON.stringify(selectedVariationAttributes)}-${index}`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    aspectRatio="square"
                    showLoadingState
                    placeholder="skeleton"
                    priority={index === 0 && !lazy}
                    lazy={lazy || index > 0}
                  />

                  {/* Image Counter */}
                  {processedImages.length > 1 && (
                    <Badge
                      variant="secondary"
                      className="absolute right-4 bottom-4 text-xs"
                    >
                      {index + 1} / {processedImages.length}
                    </Badge>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {processedImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </>
          )}
        </Carousel>
      </Card>

      {/* Thumbnail Navigation */}
      {processedImages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Product Images</span>
            <span className="text-muted-foreground text-xs">
              {current + 1} of {count}
            </span>
          </div>

          <Carousel
            opts={{
              align: "start",
              containScroll: "keepSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {processedImages.map((image, index) => (
                <CarouselItem
                  key={`thumb-${JSON.stringify(selectedVariationAttributes)}-${index}`}
                  className="basis-1/4 pl-2 sm:basis-1/5 md:basis-1/6"
                >
                  <button
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all duration-200",
                      index === current
                        ? "border-primary ring-primary/20 shadow-md ring-2"
                        : "border-muted hover:border-muted-foreground",
                    )}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      aspectRatio="square"
                      lazy={lazy || index > 3}
                      showLoadingState={false}
                    />
                    {index === current && (
                      <div className="bg-primary/10 absolute inset-0" />
                    )}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {processedImages.length > 6 && (
              <>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* No Images Available */}
      {images.length === 0 && (
        <Card className="bg-muted/30 flex aspect-square items-center justify-center">
          <div className="text-muted-foreground text-center">
            <p className="text-sm">No images available</p>
            {Object.keys(selectedVariationAttributes).length > 0 && (
              <p className="mt-1 text-xs">for selected variation</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// Skeleton component for loading state
export function ProductImageGallerySkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image skeleton */}
      <Card className="bg-muted/30 aspect-square">
        <div className="bg-muted h-full w-full animate-pulse rounded-lg" />
      </Card>

      {/* Thumbnail skeletons */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted aspect-square w-20 animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

// Utility component for product image previews in listings
export function ProductImagePreview({
  imageGroups,
  productName = "Product",
  selectedVariationAttributes = {},
  type = "small",
  className,
}: ProductImageGalleryProps) {
  const imageGroup = useMemo(
    () =>
      findImageGroupBy(imageGroups || [], {
        viewType: type,
        selectedVariationAttributes,
      }),
    [imageGroups, selectedVariationAttributes, type],
  );

  const primaryImage = imageGroup?.images?.[0] || {
    disBaseLink: "/placeholder.svg?height=300&width=300",
    alt: productName,
  };

  const totalImages = imageGroup?.images?.length || 0;

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg",
        className,
      )}
    >
      <Image
        src={primaryImage.disBaseLink || "/placeholder.svg"}
        alt={primaryImage.alt || productName}
        className="h-full w-full object-cover"
        aspectRatio="square"
        showLoadingState
        placeholder="skeleton"
      />
      {totalImages > 1 && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          +{totalImages - 1}
        </Badge>
      )}
    </div>
  );
}
