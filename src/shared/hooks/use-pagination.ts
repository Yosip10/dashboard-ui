import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  /** Página actual que se está mostrando */
  currentPage: number;
  /** Cantidad de registros por página */
  pageSize: number;
  /** Páginas que ya fueron visitadas y tienen datos confirmados */
  visitedPages: number[];
  /**
   * Llamar cuando lleguen los datos de la página actual.
   * @param count - Cantidad de registros recibidos.
   */
  handleDataLoaded: (count: number) => void;
  /** Ir directamente a una página ya visitada */
  goToPage: (page: number) => void;
  /** Avanzar a la siguiente página */
  nextPage: () => void;
  /** Retroceder a la página anterior */
  prevPage: () => void;
  /** Valor de skip para la query (offset) */
  skip: number;
  /** true si se detectó que no hay más datos adelante */
  isAtEnd: boolean;
  /** true mientras se está esperando confirmar si la siguiente página tiene datos */
  isPendingNext: boolean;
}

/**
 * Hook de paginación exploratoria:
 *  - No requiere totalItems ni totalPages.
 *  - Muestra la página 1 al inicio.
 *  - Al hacer click en "Siguiente":
 *      1. Entra en modo pendiente (isPendingNext = true).
 *      2. Cuando llegan los datos (handleDataLoaded):
 *         - Si hay datos → agrega la nueva página a visitedPages y se posiciona en ella.
 *         - Si no hay datos → muestra alerta, revierte a la última página con datos y marca isAtEnd.
 *  - Al retroceder o al navegar a una página ya visitada, nunca entra en modo pendiente.
 */
export function usePagination({
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions = {}): UsePaginationReturn {
  // Página actualmente visible
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Páginas con datos confirmados (empieza con la página inicial)
  const [visitedPages, setVisitedPages] = useState<number[]>([initialPage]);

  // true cuando estamos esperando confirmar si la página "next" tiene datos
  const [isPendingNext, setIsPendingNext] = useState(false);

  // true cuando sabemos que no hay más datos adelante
  const [isAtEnd, setIsAtEnd] = useState(false);

  // ------------------------------------------------------------------
  // nextPage: avanzar hacia una página no visitada aún
  // ------------------------------------------------------------------
  const nextPage = useCallback(() => {
    if (isAtEnd) return; // Ya llegamos al final, no avanzar más

    const next = currentPage + 1;
    setCurrentPage(next);
    setIsPendingNext(true);
  }, [currentPage, isAtEnd]);

  // ------------------------------------------------------------------
  // prevPage: retroceder a una página ya visitada
  // ------------------------------------------------------------------
  const prevPage = useCallback(() => {
    if (currentPage <= 1) return;
    setCurrentPage((p) => p - 1);
    setIsPendingNext(false); // Retroceder siempre es seguro
  }, [currentPage]);

  // ------------------------------------------------------------------
  // goToPage: ir directamente a una página ya visitada
  // ------------------------------------------------------------------
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1) return;
      if (!visitedPages.includes(page)) return; // Solo permitir páginas ya visitadas
      setCurrentPage(page);
      setIsPendingNext(false);
    },
    [visitedPages],
  );

  // ------------------------------------------------------------------
  // handleDataLoaded: llamar cada vez que llegan (o no) datos de la query
  // ------------------------------------------------------------------
  const handleDataLoaded = useCallback(
    (count: number) => {
      const hasData = count > 0;

      // Detectar fin de datos si recibimos menos del tamaño de página
      if (count < pageSize) {
        setIsAtEnd(true);
      } else {
        // Si recibimos una página completa y NO estábamos marcados como fin, reset
        if (!isPendingNext) {
          // Estamos navegando a una página ya conocida, nada especial que hacer
          return;
        }
        setIsAtEnd(false);
      }

      if (!isPendingNext) return; // No estábamos esperando confirmar una nueva página

      if (hasData) {
        // ✅ Hay datos → confirmar la nueva página como visitada
        setVisitedPages((prev) =>
          prev.includes(currentPage)
            ? prev
            : [...prev, currentPage].sort((a, b) => a - b),
        );
        setIsPendingNext(false);
      } else {
        // ❌ No hay datos → revertir a la última página conocida con datos
        const lastGoodPage = visitedPages[visitedPages.length - 1] ?? 1;
        setCurrentPage(lastGoodPage);
        setIsPendingNext(false);
        setIsAtEnd(true);
        toast.warning("No hay más registros disponibles.", {
          description: "Has llegado al final de la lista.",
        });
      }
    },
    [isPendingNext, currentPage, visitedPages, pageSize],
  );

  return {
    currentPage,
    pageSize,
    visitedPages,
    handleDataLoaded,
    goToPage,
    nextPage,
    prevPage,
    skip: (currentPage - 1) * pageSize,
    isAtEnd,
    isPendingNext,
  };
}
