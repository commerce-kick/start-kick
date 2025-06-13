import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";

interface ShopTheLookProps {
  component: Component;
}

export function ShopTheLook({ component }: ShopTheLookProps) {
  const { data } = component;
  const { product, priceDisplay = true } = data || {};

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          layout="fullWidth"
          src="/placeholder.svg?height=300&width=300"
          alt={`Look ${product}`}
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 font-semibold">Look {product}</h3>
        {priceDisplay && <p className="mb-2 text-lg font-bold">$149.99</p>}
        <Button className="w-full">Shop This Look</Button>
      </CardContent>
    </Card>
  );
}
