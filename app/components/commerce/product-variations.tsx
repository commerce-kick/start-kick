import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";

interface ProductVariationsProps {
  variationAttributes?: Array<ShopperProductsTypes.VariationAttribute>;
  variants?: Array<ShopperProductsTypes.Variant>;
  selectedVariations?: Record<string, string>;
  onVariationChange?: (variations: Record<string, string>) => void;
}

export function ProductVariations({
  variationAttributes,
  variants,
  selectedVariations = {},
  onVariationChange,
}: ProductVariationsProps) {
  const handleVariationSelect = (attributeId: string, value: string) => {
    const newVariations = { ...selectedVariations, [attributeId]: value };
    onVariationChange?.(newVariations);
  };

  // Helper function to check if a variation value is orderable
  const isVariationValueOrderable = (attributeId: string, value: string) => {
    if (!variants) return true;

    // Check if any variant with this variation value is orderable
    return variants.some(
      (variant) =>
        variant.variationValues?.[attributeId] === value &&
        variant.orderable !== false
    );
  };

  // Helper function to check if a variation value is available given current selections
  const isVariationValueAvailable = (attributeId: string, value: string) => {
    if (!variants) return true;

    // Create a test selection with the current value
    const testSelection = { ...selectedVariations, [attributeId]: value };

    // Check if any variant matches this combination and is orderable
    return variants.some((variant) => {
      const matchesSelection = Object.entries(testSelection).every(
        ([attrId, attrValue]) => variant.variationValues?.[attrId] === attrValue
      );
      return matchesSelection && variant.orderable !== false;
    });
  };

  if (!variationAttributes || variationAttributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {variationAttributes.map((attribute) => {
        if (!attribute.id || !attribute.values) return null;

        // Filter values to only show orderable ones
        const orderableValues = attribute.values.filter((value) =>
          isVariationValueOrderable(attribute.id!, value.value!)
        );

        if (orderableValues.length === 0) return null;

        return (
          <div key={attribute.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{attribute.name || attribute.id}</h3>
              {selectedVariations[attribute.id] && (
                <Badge variant="secondary" className="text-xs">
                  {orderableValues.find(
                    (v) => v.value === selectedVariations[attribute.id]
                  )?.name || selectedVariations[attribute.id]}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {orderableValues.map((value, index) => {
                if (!value.value) return null;

                const isSelected = selectedVariations[attribute.id] === value.value;
                const isAvailable = isVariationValueAvailable(attribute.id!, value.value!);

                return (
                  <Button
                    key={`${attribute.id}-${value.value}-${index}`}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!isAvailable}
                    onClick={() =>
                      handleVariationSelect(attribute.id!, value.value!)
                    }
                    className={cn(
                      "relative",
                      !isAvailable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {value.name || value.value}
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-destructive rotate-45" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Show count of available options */}
            {orderableValues.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {orderableValues.length} {orderableValues.length === 1 ? 'option' : 'options'} available
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}