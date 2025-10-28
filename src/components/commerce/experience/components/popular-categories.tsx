import { Component } from "@/integrations/salesforce/types/page";
import { Region } from "../region";

interface PopularCategoriesProps {
  component: Component;
}

export function PopularCategories({ component }: PopularCategoriesProps) {
  const { data, regions } = component as any;
  const { textHeadline } = data || {};

  return (
    <div className="container mx-auto px-4 py-6">
      {textHeadline && (
        <h2 className="mb-6 text-center text-2xl font-bold">{textHeadline}</h2>
      )}

      {regions?.map((region) => (
        <Region
          key={region.id}
          region={region}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        />
      ))}
    </div>
  );
}
