import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Minus, Plus, Share2, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useWishList } from "@/hooks/use-wishlist";
import { getProductsByIdsQueryOptions } from "@/integrations/salesforce/options/products";

export const Route = createFileRoute("/_account/wishlist")({
  component: RouteComponent,
});

function RouteComponent() {
  const { wishList, isLoading: wishListLoading } = useWishList();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Extract product IDs from wishlist items
  const productIds =
    wishList?.customerProductListItems
      ?.map((item) => item.productId)
      .filter(Boolean)
      .join(",") || "";

  // Fetch full product details
  const { data: productsResult, isLoading: productsLoading } = useQuery({
    ...getProductsByIdsQueryOptions({ ids: productIds }),
    enabled: !!productIds && productIds.length > 0,
  });

  const products = productsResult?.data || [];
  const isLoading = wishListLoading || productsLoading;

  const handleUpdateQuantity = async (
    itemId: string,
    newQuantity: number,
  ) => {};

  const handleRemoveItem = async (itemId: string) => {};

  const handleAddToCart = async (productId: string, quantity: number) => {};

  const handleShareWishlist = async () => {};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="bg-muted h-32 w-32 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="bg-muted h-6 w-3/4 rounded" />
                      <div className="bg-muted h-4 w-1/2 rounded" />
                      <div className="bg-muted h-8 w-24 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const wishlistItems = wishList?.customerProductListItems || [];

  if (wishlistItems.length === 0) {
    return (
      <>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
        </div>

        <Card className="py-12 text-center">
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
      </>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareWishlist}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          {wishList?.public && <Badge variant="secondary">Public</Badge>}
        </div>
      </div>

      <div className="grid gap-6">
        {wishlistItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const isUpdating = updatingItems.has(item.id || "");
          const productImage = product?.imageGroups?.[0]?.images?.[0];

          return (
            <Card key={item.id} className="overflow-hidden py-0">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative h-32 w-32 flex-shrink-0">
                    {productImage ? (
                      <Image
                        src={productImage.link || "/placeholder.svg"}
                        alt={
                          productImage.alt || product?.name || "Product image"
                        }
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg">
                        <Heart className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="line-clamp-2 text-lg font-semibold">
                          {product?.name || "Product not found"}
                        </h3>
                        {product?.brand && (
                          <p className="text-muted-foreground text-sm">
                            {product.brand}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id || "")}
                        disabled={isUpdating}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {product?.shortDescription && (
                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                        {product.shortDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">
                          {product?.currency || "$"}
                          {product?.price?.toFixed(2) || "0.00"}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id || "",
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1 || isUpdating}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id || "",
                                item.quantity + 1,
                              )
                            }
                            disabled={isUpdating}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          handleAddToCart(item.productId || "", item.quantity)
                        }
                        disabled={!product || isUpdating}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>

                    {product?.availability?.messages &&
                      product.availability.messages.length > 0 && (
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            {product.availability.messages[0]}
                          </Badge>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Last updated:{" "}
          {wishList?.lastModified
            ? new Date(wishList.lastModified).toLocaleDateString()
            : "Unknown"}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
          <Button size="lg">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
        </div>
      </div>
    </>
  );
}
