import { Component } from "@/components/commerce/experience/component";
import { Region as RegionType } from "@/integrations/salesforce/types/page";
import { cn } from "@/lib/utils";

interface RegionProps {
  region: RegionType;
  className?: string;
}

export function Region({ region, className }: RegionProps) {
  if (!region.components?.length) {
    return null;
  }

  return (
    <div className={cn("w-full", className)} data-region-id={region.id}>
      {region.components.map((component) => (
        <Component key={component.id} component={component} />
      ))}
    </div>
  );
}
