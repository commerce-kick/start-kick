import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export default function SimpleProduct({
  product,
}: {
  product: { image_url: string; product_name: string; id: string };
}) {
  return (
    <Card className="h-full overflow-hidden py-0 transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.product_name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
            {product.product_name}
          </h3>
        </div>

        <Button size="sm" asChild>
          <Link
            to="/products/$productId"
            params={{
              productId: product.id,
            }}
          >
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
