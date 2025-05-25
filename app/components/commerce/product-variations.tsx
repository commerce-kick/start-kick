import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";
import { useState } from "react";

interface ProductVariationsProps {
  variationAttributes?: Array<ShopperProductsTypes.VariationAttribute>;
  onVariationChange?: (variations: Record<string, string>) => void;
}

export function ProductVariations({
  variationAttributes,
  onVariationChange,
}: ProductVariationsProps) {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});

  const handleVariationSelect = (attributeId: string, value: string) => {
    const newVariations = { ...selectedVariations, [attributeId]: value };
    setSelectedVariations(newVariations);
    onVariationChange?.(newVariations);
  };

  if (!variationAttributes || variationAttributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {variationAttributes.map((attribute) => {
        if (!attribute.id || !attribute.values) return null;

        return (
          <div key={attribute.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{attribute.name || attribute.id}</h3>
              {selectedVariations[attribute.id] && (
                <Badge variant="secondary" className="text-xs">
                  {attribute.values.find(
                    (v) => v.value === selectedVariations[attribute.id]
                  )?.name || selectedVariations[attribute.id]}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {attribute.values.map((value, index) => {
                if (!value.value) return null;

                const isSelected =
                  selectedVariations[attribute.id] === value.value;
                const isOrderable = value.orderable !== false;

                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!isOrderable}
                    onClick={() =>
                      handleVariationSelect(attribute.id!, value.value!)
                    }
                    className={cn(
                      "relative",
                      !isOrderable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {value.name || value.value}
                    {!isOrderable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-destructive rotate-45" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
