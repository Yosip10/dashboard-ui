import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useMemo } from "react";

interface PaginationControlsProps {
  currentPage: number;
  visitedPages: number[];
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  isAtEnd?: boolean;
  className?: string;
}

/**
 * Paginación que muestra un máximo de 5 botones de página.
 * Si hay más de 5 páginas visitadas, desliza la ventana para mantener la actual visible.
 */
export function PaginationControls({
  currentPage,
  visitedPages,
  onPageChange,
  onNext,
  onPrev,
  isLoading = false,
  isAtEnd = false,
  className,
}: PaginationControlsProps) {
  const isFirstPage = currentPage === 1;

  // Calculamos qué páginas mostrar (máximo 5)
  const visiblePages = useMemo(() => {
    if (visitedPages.length <= 5) return visitedPages;

    // Encontrar el índice de la página actual
    const currentIndex = visitedPages.indexOf(currentPage);

    let start = Math.max(0, currentIndex - 2);
    let end = Math.min(visitedPages.length, start + 5);

    // Ajustar si estamos cerca del final
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }

    return visitedPages.slice(start, end);
  }, [visitedPages, currentPage]);

  const maxVisited = Math.max(...visitedPages);
  const isLastVisitedVisible = visiblePages.includes(maxVisited);
  // El botón siguiente se deshabilita si llegamos al final de los datos
  // y estamos en la última página conocida
  const isNextDisabled = isAtEnd && currentPage >= maxVisited;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 py-4 px-4",
        className,
      )}
    >
      {/* Botón Anterior */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onPrev}
        disabled={isFirstPage || isLoading}
        className="gap-1 px-3 h-8 text-sm font-medium disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Páginas visibles (máximo 5) */}
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={cn(
              "h-8 w-8 p-0 text-sm font-medium transition-all duration-200",
              currentPage === pageNum
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "hover:bg-muted text-foreground",
            )}
            aria-label={`Ir a página ${pageNum}`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </Button>
        ))}

        {/* Indicador de puntos suspensivos si hay más páginas adelante que no son visibles */}
        {!isLastVisitedVisible && (
          <span className="text-muted-foreground text-sm px-1 select-none">
            …
          </span>
        )}
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onNext}
        disabled={isLoading || isNextDisabled}
        className="gap-1 px-3 h-8 text-sm font-medium disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
