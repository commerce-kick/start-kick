import SearchHit from "@/components/commerce/search-hit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";

const FiltersContent = ({
  refinements,
  productSorts,
  cgid,
  handleSelectedRinament,
  handleOnSortChange,
}: {
  refinements: ShopperSearchTypes.ProductSearchRefinement[];
  productSorts: ShopperSearchTypes.ProductSearchSortingOption[];
  cgid: string;
  handleSelectedRinament: (val: string) => void;
  handleOnSortChange: (val: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select
          defaultValue={productSorts[0].id}
          onValueChange={handleOnSortChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={productSorts[0].id} />
          </SelectTrigger>
          <SelectContent>
            {productSorts.map((sort) => {
              return (
                <SelectItem key={sort.id} value={sort.id}>
                  {sort.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link to="/" params={{ cgid }}>
          Reset
        </Link>
      </Button>

      {refinements
        .filter((r) => r.values)
        .map((refinament, index) => {
          return (
            <div className="border-t pt-4" key={`serach-${index}`}>
              <h3 className="mb-2 font-medium">{refinament.label}</h3>
              <div className="grid grid-cols-2 gap-2">
                {refinament.values?.map((val, i) => {
                  return (
                    <div
                      className="flex items-center gap-2"
                      data-url={val.url}
                      key={`ref-${i}`}
                    >
                      <Checkbox
                        id={`${val.presentationId}-${index}`}
                        onCheckedChange={() => {
                          handleSelectedRinament(val.value);
                        }}
                      />
                      <label
                        htmlFor={`${val.presentationId}-${index}`}
                        className={cn("text-sm")}
                      >
                        {val.value}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export const Route = createFileRoute("/category/$categoryId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductsQueryOptions({
        refine: [`cgid:${params.categoryId}`],
        limit: 12,
      })
    );
  },
});

function RouteComponent() {
  const { categoryId } = Route.useParams();

  const [open, setOpen] = useState(false);

  const { data } = useSuspenseQuery(
    getProductsQueryOptions({
      refine: [`cgid=${categoryId}`],
      limit: 12,
    })
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">{data.total} Results</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-4">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FiltersContent
              refinements={data.refinements}
              productSorts={data.sortingOptions}
              cgid={categoryId}
              handleSelectedRinament={() => console.log("here")}
              handleOnSortChange={() => console.log("here")}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="hidden md:block space-y-6">
          <FiltersContent
            refinements={data.refinements}
            productSorts={data.sortingOptions}
            cgid={categoryId}
            handleSelectedRinament={() => console.log("here")}
            handleOnSortChange={() => console.log("here")}
          />
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.total > 0 &&
              data.hits.map((product) => (
                <SearchHit product={product} key={product.productId} />
              ))}
            <div className="col-span-full grid grid-cols-1">
              <Button
                onClick={() => {
                  console.log("view more");
                }}
              >
                View More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
