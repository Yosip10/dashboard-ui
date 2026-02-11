import { useState, useMemo } from "react";

export interface UsePaginationProps {
    totalItems: number;
    initialPage?: number;
    initialPageSize?: number;
}

export const usePagination = ({
    totalItems,
    initialPage = 1,
    initialPageSize = 10,
}: UsePaginationProps) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return {
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        goToPage,
        nextPage,
        prevPage,
        startIndex,
        endIndex,
        setPageSize,
    };
};
