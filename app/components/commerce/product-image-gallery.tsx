import { ImageCarousel } from "@/components/commerce/image-carousel";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

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
  // Get all images from all image groups
  const allImages =
    imageGroups?.flatMap((group) => {
      return (group.viewType === type && group.images) || [];
    }) || [];

  const images =
    allImages.length > 0
      ? allImages
      : [{ link: "/placeholder.svg?height=600&width=600", alt: productName }];

  return (
    <ImageCarousel
      images={images.map((img) => ({ src: img.disBaseLink, alt: img.alt }))}
    />
  );
}
