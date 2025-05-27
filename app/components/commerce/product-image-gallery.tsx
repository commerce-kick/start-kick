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
import { useEffect, useState } from "react";

interface ProductImageGalleryProps {
  imageGroups?: Array<ShopperProductsTypes.ImageGroup>;
  productName?: string;
  type?: "large" | "small";
  className?: string;
}

export function ProductImageGallery({
  imageGroups,
  productName = "Product",
  type = "large",
  className,
}: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Get all images from all image groups
  const allImages =
    imageGroups?.flatMap((group) => {
      return group.viewType === type && group.images ? group.images : [];
    }) || [];

  const images =
    allImages.length > 0
      ? allImages.map((img) => ({
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
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    aspectRatio="square"
                    showLoadingState
                    placeholder="skeleton"
                    priority={index === 0}
                    lazy={index > 0}
                  />

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <Badge
                      variant="secondary"
                      className="absolute right-4 bottom-4 text-xs"
                    >
                      {index + 1} / {images.length}
                    </Badge>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </>
          )}
        </Carousel>
      </Card>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
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
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
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
                      lazy={index > 3}
                      showLoadingState={false}
                    />
                    {index === current && (
                      <div className="bg-primary/10 absolute inset-0" />
                    )}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 6 && (
              <>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
}
