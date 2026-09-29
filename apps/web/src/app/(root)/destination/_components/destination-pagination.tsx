"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@next-js-template/ui/components/button";

export function DestinationPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pageCount || Math.abs(number - page) <= 1,
  );

  return (
    <nav aria-label="Destination pagination" className="flex items-center gap-1 sm:gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="size-11"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <span className="px-3 text-sm text-muted-foreground sm:hidden">
        Page {page} of {pageCount}
      </span>
      {pages.map((number, index) => (
        <span key={number} className="hidden items-center gap-1.5 sm:flex">
          {index > 0 && number - pages[index - 1]! > 1 && (
            <span aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </span>
          )}
          <Button
            variant={page === number ? "default" : "ghost"}
            size="icon"
            className="size-11"
            aria-label={`Page ${number}`}
            aria-current={page === number ? "page" : undefined}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        </span>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="size-11"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
