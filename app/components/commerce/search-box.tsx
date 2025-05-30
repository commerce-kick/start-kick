import { Input } from "@/components/ui/input";
import { getSearchSuggestionsOptions } from "@/integrations/salesforce/options/search";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";
import { Search } from "lucide-react";
import { useRef, useState } from "react";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ShopperSearchTypes.SuggestionResult>(
    getSearchSuggestionsOptions({
      q: searchQuery,
    }),
  );

  const handleItemClick = (productId: string) => {
    setSearchQuery("");

    navigate({
      to: "/products/$productId",
      params: {
        productId,
      },
    });
  };

  return (
    <div className="relative hidden max-w-md flex-1 md:block">
      <form className="relative">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search products..."
          className="focus-visible:ring-primary w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      </form>

      {/* Only show popover when we have results */}

      {data?.productSuggestions?.products && (
        <div className="bg-background absolute z-10 mt-1 w-full rounded-md border py-2 shadow-md">
          <div className="text-muted-foreground px-3 py-1.5 text-xs font-medium">
            Products
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {data.productSuggestions?.products?.map((product) => (
              <button
                key={product.productId}
                className="hover:bg-muted flex w-full items-center px-3 py-2 text-left text-sm"
                onClick={() => handleItemClick(product.productId)}
              >
                <Search className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                {product.productName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show loading indicator */}
      {isLoading && searchQuery.length >= 3 && (
        <div className="bg-background text-muted-foreground absolute z-10 mt-1 w-full rounded-md border p-4 text-center text-sm shadow-md">
          Searching...
        </div>
      )}
    </div>
  );
}
