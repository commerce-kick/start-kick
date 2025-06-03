import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";

interface PhotoTileProps {
  component: Component;
}

export function PhotoTile({ component }: PhotoTileProps) {
  const { data } = component;
  const { image } = data || {};

  if (!image?.url) {
    return null;
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        layout="fullWidth"
        src={image.url || "/placeholder.svg"}
        alt=""
        className="object-cover"
      />
    </div>
  );
}
