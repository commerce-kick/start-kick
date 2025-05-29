import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Filter, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import ProductCard from "@/components/commerce/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishList } from "@/hooks/use-wishlist";
import { useAddItemToProductListMutation } from "@/integrations/salesforce/options/customer";
import { cn } from "@/lib/utils";
import type { ShopperSearchTypes } from "commerce-sdk-isomorphic";
import { z } from "zod";

const REQUESTED_LIMIT = 25;

export const Route = createFileRoute("/category/$categoryId")({
  component: RouteComponent,
  validateSearch: z.object({
    offset: z.number().optional(),
    sort: z.string().optional(),
    refinements: z.record(z.array(z.string())).optional(),
  }),
  loader: async ({ params, context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductsQueryOptions({
        refine: [`cgid:${params.categoryId}`],
        limit: 12,
      }),
    );
  },
});

const FiltersContent = ({
  refinements,
  productSorts,
  cgid,
  selectedRefinements = {},
  selectedSort,
  handleSelectedRefinement,
  handleOnSortChange,
  handleClearFilters,
}: {
  refinements: ShopperSearchTypes.ProductSearchRefinement[];
  productSorts: ShopperSearchTypes.ProductSearchSortingOption[];
  cgid: string;
  selectedRefinements?: Record<string, string[]>;
  selectedSort?: string;
  handleSelectedRefinement: (attributeId: string, value: string) => void;
  handleOnSortChange: (val: string) => void;
  handleClearFilters: () => void;
}) => {
  const hasActiveFilters = Object.keys(selectedRefinements).length > 0;

  return (
    <div className="space-y-6">
      {/* Sort Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <h3 className="font-medium">Sort by</h3>
            </div>
            <Select
              value={selectedSort || productSorts[0]?.id}
              onValueChange={handleOnSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                {productSorts.map((sort) => (
                  <SelectItem key={sort.id} value={sort.id}>
                    {sort.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Active Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedRefinements).map(
                  ([attributeId, values]) =>
                    values.map((value) => (
                      <Badge
                        key={`${attributeId}-${value}`}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          handleSelectedRefinement(attributeId, value)
                        }
                      >
                        {value}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Sections */}
      {refinements
        .filter((r) => r.values && r.values.length > 0)
        .map((refinement, index) => (
          <Card key={`refinement-${index}`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-medium">{refinement.label}</h3>
                <Separator />
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {refinement.values?.map((val, i) => {
                    const isSelected =
                      selectedRefinements[refinement.attributeId]?.includes(
                        val.value,
                      ) || false;
                    return (
                      <div
                        className="flex items-center justify-between space-x-2"
                        key={`ref-${i}`}
                      >
                        <div className="flex flex-1 items-center space-x-2">
                          <Checkbox
                            id={`${val.presentationId}-${index}`}
                            checked={isSelected}
                            onCheckedChange={() => {
                              handleSelectedRefinement(
                                refinement.attributeId,
                                val.value,
                              );
                            }}
                          />
                          <label
                            htmlFor={`${val.presentationId}-${index}`}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            {val.label || val.value}
                          </label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {val.hitCount}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Reset Button */}
      <Button variant="outline" className="w-full" asChild>
        <Link to="/" params={{ cgid }}>
          <X className="mr-2 h-4 w-4" />
          Reset All Filters
        </Link>
      </Button>
    </div>
  );
};

function ProductPagination({
  data,
  requestedLimit,
}: {
  requestedLimit: number;
  data: ShopperSearchTypes.ProductSearchResult;
}) {
  const { offset = 0 } = useSearch({ from: "/category/$categoryId" });
  const navigate = useNavigate({ from: "/category/$categoryId" });

  const { total } = data;
  const limit = requestedLimit;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const itemsStart = offset + 1;
  const itemsEnd = Math.min(offset + limit, total);

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * limit;
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  };

  const nextPage = () => {
    if (hasNext) {
      navigate({
        search: (prev) => ({ ...prev, offset: offset + limit }),
      });
    }
  };

  const prevPage = () => {
    if (hasPrev) {
      navigate({
        search: (prev) => ({ ...prev, offset: Math.max(0, offset - limit) }),
      });
    }
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground text-sm">
          Showing {total} {total === 1 ? "product" : "products"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results info */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Showing {itemsStart}-{itemsEnd} of {total} products
        </p>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              className={cn(!hasPrev && "pointer-events-none opacity-50")}
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => goToPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              className={cn(!hasNext && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page info */}
      <div className="text-center">
        <p className="text-muted-foreground text-xs">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
}

function ProductGridSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <div
      className={cn(
        "grid gap-6",
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1",
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sort Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Filter Sections Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Separator />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div className="flex flex-1 items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RouteComponent() {
  const {
    offset = 0,
    sort,
    refinements = {},
  } = useSearch({ from: "/category/$categoryId" });

  const { categoryId } = Route.useParams();
  const navigate = useNavigate({ from: "/category/$categoryId" });

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { wishList } = useWishList();
  const addToWishListMutation = useAddItemToProductListMutation();

  // Build refine array for API
  const refineArray = [`cgid=${categoryId}`];
  Object.entries(refinements).forEach(([attributeId, values]) => {
    if (values.length > 0) {
      // Join multiple values with pipe separator instead of creating separate entries
      const joinedValues = values.join("|");
      refineArray.push(`${attributeId}=${joinedValues}`);
    }
  });

  const { data, isLoading, isError } = useQuery(
    getProductsQueryOptions({
      refine: refineArray,
      limit: REQUESTED_LIMIT,
      offset: offset,
      sort: sort,
    }),
  );

  const handleSelectedRefinement = (attributeId: string, value: string) => {
    const currentValues = refinements[attributeId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newRefinements = { ...refinements };
    if (newValues.length === 0) {
      delete newRefinements[attributeId];
    } else {
      newRefinements[attributeId] = newValues;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        refinements:
          Object.keys(newRefinements).length > 0 ? newRefinements : undefined,
        offset: 0, // Reset to first page when filtering
      }),
    });
  };

  const handleOnSortChange = (newSort: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: newSort,
        offset: 0, // Reset to first page when sorting
      }),
    });
  };

  const handleClearFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        refinements: undefined,
        offset: 0,
      }),
    });
  };

  const handleAddToWishList = (productId: string) => {
    if (!wishList?.id) {
      return;
    }

    addToWishListMutation.mutate({
      listId: wishList?.id,
      productId: productId,
    });
  };

  const activeFiltersCount = Object.values(refinements).reduce(
    (acc, values) => acc + values.length,
    0,
  );

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Something went wrong</h3>
              <p className="text-muted-foreground">
                Failed to load products. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {data?.total} {data?.total === 1 ? "result" : "results"} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden rounded-md border sm:flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative md:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 sm:w-[350px]">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-y-auto p-4">
                {isLoading || !data ? (
                  <FiltersSkeleton />
                ) : (
                  <FiltersContent
                    refinements={data.refinements}
                    productSorts={data.sortingOptions}
                    cgid={categoryId}
                    selectedRefinements={refinements}
                    selectedSort={sort}
                    handleSelectedRefinement={handleSelectedRefinement}
                    handleOnSortChange={handleOnSortChange}
                    handleClearFilters={handleClearFilters}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Filters Sidebar */}
        <div className="hidden space-y-6 lg:block">
          <div className="sticky top-4">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h2 className="font-semibold">Filters</h2>
              {!isLoading && activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </div>
            {isLoading || !data ? (
              <FiltersSkeleton />
            ) : (
              <FiltersContent
                refinements={data.refinements}
                productSorts={data.sortingOptions}
                cgid={categoryId}
                selectedRefinements={refinements}
                selectedSort={sort}
                handleSelectedRefinement={handleSelectedRefinement}
                handleOnSortChange={handleOnSortChange}
                handleClearFilters={handleClearFilters}
              />
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6 lg:col-span-3">
          {isLoading ? (
            <>
              <ProductGridSkeleton viewMode={viewMode} />
              <div className="space-y-4">
                <div className="text-center">
                  <Skeleton className="mx-auto h-4 w-48" />
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            </>
          ) : data && data.total > 0 ? (
            <>
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {data.hits.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.productId}
                    viewMode={viewMode}
                    onWishListToggle={() =>
                      handleAddToWishList(product.productId)
                    }
                    isFavorite={wishList?.customerProductListItems?.some(
                      (p) => p.productId === product.productId,
                    )}
                  />
                ))}
              </div>

              <ProductPagination data={data} requestedLimit={REQUESTED_LIMIT} />
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
