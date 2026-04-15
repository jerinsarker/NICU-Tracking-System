import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface ListSearchPaginationProps<T> {
  data: T[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder: string;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  filterFn: (item: T, query: string) => boolean;
  children: (paginatedData: T[], startIndex: number) => React.ReactNode;
}

export function useListPagination<T>(
  data: T[],
  searchQuery: string,
  filterFn: (item: T, query: string) => boolean,
  pageSize: number,
  currentPage: number
) {
  const filtered = searchQuery
    ? data.filter((item) => filterFn(item, searchQuery.toLowerCase()))
    : data;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
  return { filtered, paginatedData, totalPages, safePage, startIndex };
}

export function ListSearchBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 max-w-sm"
      />
    </div>
  );
}

export function ListPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  startIndex,
  endIndex,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems}
        </span>
        <span className="mx-1">|</span>
        <span>Rows:</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
            ) : (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </Button>
            )
          )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
