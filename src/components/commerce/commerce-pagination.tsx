import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function CommercePagination({
  total,
  requestedLimit,
  offset,
  onNext,
  onPrev,
  onGoToPage,
}: {
  requestedLimit: number;
  total: number;
  offset: number;
  onNext: (offset: number) => void;
  onPrev: (offset: number) => void;
  onGoToPage: (offset: number) => void;
}) {
  const limit = requestedLimit;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const itemsStart = offset + 1;
  const itemsEnd = Math.min(offset + limit, total);

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * limit;
    onGoToPage(newOffset);
  };

  const nextPage = () => {
    if (hasNext) {
      onNext(offset + limit);
    }
  };

  const prevPage = () => {
    if (hasPrev) {
      onPrev(Math.max(0, offset - limit));
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
