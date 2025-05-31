import { Header } from "@/components/commerce/header";
import { HeaderSkeleton } from "@/components/commerce/header-skeleton";
import { ShopperCustomersTypes, ShopperProductsTypes } from "commerce-sdk-isomorphic";

interface HeaderWithFallbackProps {
  categories: ShopperProductsTypes.Category[] | undefined;
  user?: ShopperCustomersTypes.Customer;
}

export function HeaderWithFallback({ categories, user }: HeaderWithFallbackProps) {
  // If categories is undefined, show the skeleton
  if (!categories) {
    return <HeaderSkeleton />;
  }

  // Otherwise, render the actual header
  return <Header categories={categories} user={user} />;
}
