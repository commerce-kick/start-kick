import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountPageSkeletonProps {
  variant?: "default" | "list";
  cards?: number;
  cardItems?: number;
}

export function AccountPageSkeleton({
  variant = "default",
  cards = 4,
  cardItems = 3,
}: AccountPageSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {variant === "default" ? (
        // Grid layout for forms and settings
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: cards }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-muted/50 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Array.from({ length: cardItems }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List layout for orders, wishlist items, etc.
        <div className="space-y-6">
          {Array.from({ length: cards }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-3">
                      {Array.from({ length: cardItems }).map((_, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between bg-muted/30 p-3 rounded-lg"
                        >
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-border my-6" />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
