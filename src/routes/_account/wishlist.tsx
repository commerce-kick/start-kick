import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { AccountPageSkeleton } from "@/components/commerce/account/account-page-skeleton";
import ProductCard from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWishList } from "@/hooks/use-wishlist";
import { useDeleteItemFromProductListMutation } from "@/integrations/salesforce/options/customer";
import { getProductsByIdsQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShopperProductsTypes } from "commerce-sdk-isomorphic";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_account/wishlist")({
  component: RouteComponent,
});

function WishlistContent() {
  const { wishList, isLoading: wishListLoading } = useWishList();

  const isMobile = useIsMobile();

  const productIds =
    wishList?.customerProductListItems
      ?.map((item) => item.productId)
      .filter(Boolean)
      .join(",") || "";

  const { data: productsResult, isLoading: productsLoading } = useSuspenseQuery(
    getProductsByIdsQueryOptions({ ids: productIds }),
  );

  const deleteItemFromListMutation = useDeleteItemFromProductListMutation();

  const wishlistItems = wishList?.customerProductListItems || [];
  const products = productsResult?.data || [];

  const handleRemoveFromList = (itemId: string) => {
    if (!wishList?.id) {
      return;
    }

    deleteItemFromListMutation.mutateAsync({
      listId: wishList?.id,
      itemId: itemId,
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Heart className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="text-muted-foreground">Manage your wishlist</p>
          </div>
        </div>

        <Card className="text-center">
          <CardContent>
            <Heart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h2 className="mb-2 text-2xl font-semibold">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Start adding items you love to your wishlist and keep track of
              them here.
            </p>
            <Button size="lg">Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Heart className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="text-muted-foreground">Manage your wishlist</p>
        </div>
      </div>

      <div className="grid gap-6">
        {wishlistItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);

          return (
            <ProductCard
              key={product?.id}
              product={product as ShopperProductsTypes.Product}
              viewMode={isMobile ? "grid" : "list"}
              isFavorite={true}
              onWishListToggle={() => {
                if (!item.id) {
                  return;
                }
                handleRemoveFromList(item.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <Suspense fallback={<AccountPageSkeleton variant="default" cards={2} />}>
      <WishlistContent />
    </Suspense>
  );
}
