import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductImageGalleryProps {
  imageGroups?: Array<ShopperProductsTypes.ImageGroup>;
  productName?: string;
  type?: "large" | "small";
}

export function ProductImageGallery({
  imageGroups,
  type = "large",
  productName,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get all images from all image groups
  const allImages =
    imageGroups?.flatMap((group) => {
      return (group.viewType === type && group.images) || [];
    }) || [];

  console.log(allImages);

  const images =
    allImages.length > 0
      ? allImages
      : [{ link: "/placeholder.svg?height=600&width=600", alt: productName }];

  const selectedImage = images[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={selectedImage?.link || "/placeholder.svg"}
          alt={selectedImage?.alt || productName || "Product image"}
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden border-2 transition-colors",
                selectedImageIndex === index
                  ? "border-primary"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={image?.link || "/placeholder.svg"}
                alt={image?.alt || `Product image ${index + 1}`}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
