import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";

interface Props {
  totalPages: number;
}

const CustomPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = searchParams.get("page") ?? "1";
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  const getVisiblePages = () => {
    const delta =
      typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2;
    const range: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />{" "}
        <span className="hidden sm:inline">atras</span>
      </Button>
      {visiblePages.map((pageNum, index) =>
        pageNum === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 sm:px-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={page === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        <span className="hidden sm:inline">siguiente</span>{" "}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CustomPagination;
