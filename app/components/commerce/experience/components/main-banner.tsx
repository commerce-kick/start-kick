import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";

interface MainBannerProps {
  component: Component;
}

export function MainBanner({ component }: MainBannerProps) {
  const { data } = component;
  const { image, heading, categoryLink } = data || {};

  return (
    <div className="relative h-96 overflow-hidden rounded-lg">
      {image?.url && (
        <Image
          src={image.url || "/placeholder.svg"}
          alt=""
          layout="fullWidth"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <div className="text-center text-white">
          {heading && (
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
          {categoryLink && (
            <Button asChild size="lg">
              <a href={categoryLink}>Shop Now</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
