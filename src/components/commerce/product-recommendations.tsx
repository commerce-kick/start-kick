import SimpleProduct from "@/components/commerce/simple-product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import getProductRecsQueryOptions from "@/integrations/salesforce/options/einstein";
import { useQuery } from "@tanstack/react-query";

export function ProductRecommendations({
  recId,
  products,
}: {
  recId: string;
  products: { id: string }[];
}) {
  const { data, isLoading } = useQuery(
    getProductRecsQueryOptions({ recId, products }),
  );

  if (isLoading || !data?.recs) {
    return <></>;
  }

  return (
    <section className="space-y-6 py-12 md:py-16">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl">Product Recomendations</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          exercitationem
        </p>
      </div>

      <Carousel className="mx-auto">
        <CarouselContent>
          {data.recs?.map((product, index) => (
            <CarouselItem key={`product-${index}`} className="md:basis-1/4">
              <SimpleProduct product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
