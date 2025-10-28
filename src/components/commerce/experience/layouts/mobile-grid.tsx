import { Component as ComponentType } from "@/integrations/salesforce/types/page";

import { Region } from "@/components/commerce/experience/region";
import { cn } from "@/lib/utils";

interface MobileGridProps {
  component: ComponentType;
}

export function MobileGrid({ component }: MobileGridProps) {
  const { regions, typeId } = component as any;

  if (!regions?.length) {
    return null;
  }

  // Determine grid layout based on typeId
  const getGridClasses = () => {
    switch (typeId) {
      case "commerce_layouts.mobileGrid1r1c":
        return "grid grid-cols-1 gap-4";
      case "commerce_layouts.mobileGrid2r1c":
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      case "commerce_layouts.mobileGrid3r2c":
        return "grid grid-cols-2 md:grid-cols-3 gap-4";
      case "commerce_layouts.mobileGridLookBook":
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4";
      default:
        return "grid grid-cols-1 gap-4";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className={cn(getGridClasses())}>
        {regions.map((region) => (
          <Region key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
}
