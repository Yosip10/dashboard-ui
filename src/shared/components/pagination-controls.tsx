import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/shared/ui/pagination";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="py-4 px-4 border-b-0">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-200"}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink

                                onClick={() => onPageChange(pageNum)}
                                isActive={currentPage === pageNum}
                                className={`cursor-pointer bg-gray-100 hover:bg-gray-300 text-gray-800 hover:text-gray-800 active:bg-gray-300 ${currentPage === pageNum ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}`}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-200"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {/*  <div className="text-center mt-2 text-xs text-muted-foreground">
                Mostrando {Math.min(itemsPerPage, totalItems)} de {totalItems} resultados
            </div> */}
        </div>
    );
}
