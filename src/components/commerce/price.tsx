import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

export default function Price({
  promotion,
  currency,
  priceMax,
  unit,
  price,
  className,
}: {
  price?: number;
  currency?: string;
  priceMax?: number;
  unit?: string;
  promotion?: ShopperProductsTypes.ProductPromotion;
  className?: string;
}) {
  const formatPrice = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        {promotion?.promotionalPrice ? (
          <>
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(promotion.promotionalPrice)}
            </span>
            <span className="text-muted-foreground text-xl line-through">
              {formatPrice(price)}
            </span>
            <Badge variant="destructive">{promotion.calloutMsg}</Badge>
          </>
        ) : priceMax && priceMax !== price ? (
          <span className="text-3xl font-bold">
            {formatPrice(price)} - {formatPrice(priceMax)}
          </span>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(price)}</span>
        )}
      </div>
      {unit && (
        <p className="text-muted-foreground text-sm">Price per {unit}</p>
      )}
    </div>
  );
}
