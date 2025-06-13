import { CampaignBanner } from "@/components/commerce/experience/components/campain-banner";
import { Category } from "@/components/commerce/experience/components/category";
import { EditorialRichText } from "@/components/commerce/experience/components/editorial-rich-text";
import { ImageAndText } from "@/components/commerce/experience/components/image-and-text";
import { MainBanner } from "@/components/commerce/experience/components/main-banner";
import { PhotoTile } from "@/components/commerce/experience/components/photo-tile";
import { PopularCategories } from "@/components/commerce/experience/components/popular-categories";
import { PopularCategory } from "@/components/commerce/experience/components/popular-category";
import { ProductTile } from "@/components/commerce/experience/components/product-tile";
import { ShopTheLook } from "@/components/commerce/experience/components/shop-the-look";
import { Carousel } from "@/components/commerce/experience/layouts/carousel";
import { MobileGrid } from "@/components/commerce/experience/layouts/mobile-grid";
import { Component as ComponentType } from "@/integrations/salesforce/types/page";

const COMPONENTS = {
  // Layout Components
  "commerce_layouts.mobileGrid1r1c": MobileGrid,
  "commerce_layouts.mobileGrid2r1c": MobileGrid,
  "commerce_layouts.mobileGrid3r2c": MobileGrid,
  "commerce_layouts.mobileGridLookBook": MobileGrid,
  "commerce_layouts.carousel": Carousel,
  "commerce_layouts.popularCategories": PopularCategories,

  // Asset Components
  "commerce_assets.campaignBanner": CampaignBanner,
  "commerce_assets.imageAndText": ImageAndText,
  "commerce_assets.editorialRichText": EditorialRichText,
  "commerce_assets.productTile": ProductTile,
  "commerce_assets.photoTile": PhotoTile,
  "commerce_assets.mainBanner": MainBanner,
  "commerce_assets.shopTheLook": ShopTheLook,
  "commerce_assets.category": Category,
  "commerce_assets.popularCategory": PopularCategory,
};

interface ComponentProps {
  component: ComponentType;
}

function NotFound({ component }: { component: ComponentType }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
      <p className="text-sm text-gray-500">
        Component not found: {component.typeId}
      </p>
      <p className="text-xs text-gray-400">ID: {component.id}</p>
    </div>
  );
}

export function Component({ component }: ComponentProps) {
  const ComponentToRender =
    COMPONENTS[component.typeId as keyof typeof COMPONENTS] || NotFound;

  return (
    <div
      data-component-id={component.id}
      data-component-type={component.typeId}
    >
      <ComponentToRender component={component} />
    </div>
  );
}
