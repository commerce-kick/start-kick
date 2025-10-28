import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";
import { Star } from "lucide-react";

interface ProductTileProps {
  component: Component;
}

export function ProductTile({ component }: ProductTileProps) {
  const { data } = component as any;
  const { product, displayRatings = false } = data || {};

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src="/placeholder.svg?height=300&width=300"
          alt={`Product ${product}`}
          className="object-cover"
          layout="fullWidth"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 font-semibold">Product {product}</h3>
        <p className="mb-2 text-lg font-bold">$99.99</p>
        {displayRatings && (
          <div className="mb-3 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-muted-foreground ml-2 text-sm">(4.5)</span>
          </div>
        )}
        <Button className="w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
