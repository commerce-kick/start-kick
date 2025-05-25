
import { Badge } from "@/components/ui/badge";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

export default function Price({
  promotion,
  currency,
  priceMax,
  unit,
  price,
}: {
  price?: number;
  currency?: string;
  priceMax?: number;
  unit?: string;
  promotion?: ShopperProductsTypes.ProductPromotion;
}) {
  const formatPrice = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {promotion?.promotionalPrice ? (
          <>
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(promotion.promotionalPrice)}
            </span>
            <span className="text-xl text-muted-foreground line-through">
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
        <p className="text-sm text-muted-foreground">Price per {unit}</p>
      )}
    </div>
  );
}
