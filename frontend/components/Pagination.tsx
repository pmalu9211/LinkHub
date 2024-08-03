import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const disabledClass = "pointer-events-none opacity-50";

export function PaginationDemo({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: any;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              setPage((e: number) => {
                return --e;
              })
            }
            className={page === 1 ? disabledClass : ""}
          />
        </PaginationItem>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
            </PaginationItem>
            <span>...</span>
          </>
        )}
        <PaginationItem className="mx-2">
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        {page < totalPages && (
          <>
            <span>...</span>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setPage((e: number) => {
                return ++e;
              })
            }
            className={page === totalPages ? disabledClass : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
