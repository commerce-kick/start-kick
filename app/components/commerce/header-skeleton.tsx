import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button skeleton */}
          <Skeleton className="h-8 w-8 rounded-md" />
          
          {/* Logo skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          
          {/* Navigation menu skeleton */}
          <div className="hidden md:flex items-center space-x-1">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search box skeleton */}
          <Skeleton className="h-8 w-8 rounded-md" />
          
          {/* Basket skeleton */}
          <Skeleton className="h-8 w-8 rounded-md" />
          
          {/* User menu skeleton */}
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </header>
  );
}
