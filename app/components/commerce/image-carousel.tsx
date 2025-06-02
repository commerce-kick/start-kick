import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "@/components/ui/image";

export function ImageCarousel({
  images,
}: {
  images: { src?: string; alt?: string }[];
}) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            {image.src && (
              <Image layout="fullWidth" className="w-full" alt={image.alt} src={image.src} />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
