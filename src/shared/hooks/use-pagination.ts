import { useState, useCallback } from "react";

export interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  visitedPages: number[];
  /**
   * Llamar cuando lleguen datos de la página actual.
   * @param count - Cantidad de registros recibidos.
   */
  handleDataLoaded: (count: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  skip: number;
  isAtEnd: boolean;
}

/**
 * Hook de paginación "exploratoria":
 * - Sin `totalItems` ni `totalPages`.
 * - Acumula las páginas que tienen datos en `visitedPages`.
 * - Al avanzar: si la respuesta viene vacía, muestra alerta y
 *   revierte a la última página con datos.
 * - Detecta si se ha llegado al final si los registros recibidos son menores al pageSize.
 */
export function usePagination({
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [visitedPages, setVisitedPages] = useState<number[]>([initialPage]);
  // Página a la que se intentó navegar (para revertir si viene vacía)
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1) return;
      // Si ya fue visitada, navegamos directo sin pedir confirmación de datos
      const alreadyVisited = visitedPages.includes(page);
      setPendingPage(alreadyVisited ? null : page);
      setCurrentPage(page);
    },
    [visitedPages],
  );

  const nextPage = useCallback(() => {
    // * Si ya marcamos el final, no permitimos avanzar más allá de lo visitado
    if (isAtEnd && currentPage >= Math.max(...visitedPages)) return;

    const next = currentPage + 1;
    setPendingPage(next);
    setCurrentPage(next);
  }, [currentPage, isAtEnd, visitedPages]);

  const prevPage = useCallback(() => {
    const prev = currentPage - 1;
    if (prev < 1) return;
    // Retroceder siempre es seguro (ya visitamos esa página)
    setPendingPage(null);
    setCurrentPage(prev);
  }, [currentPage]);

  /**
   * Debe ser llamado por la página que consume el hook
   * cada vez que llegan (o no) datos de la consulta.
   *
   * @param count – cantidad de elementos recibidos.
   */
  const handleDataLoaded = useCallback(
    (count: number) => {
      const hasData = count > 0;

      // Si recibimos menos elementos que el pageSize, definitivamente llegamos al final.
      if (count < pageSize) {
        setIsAtEnd(true);
      } else {
        // Si recibimos exactamente pageSize, podrías haber más (o no), reseteamos el fin por si acaso
        // solo si estamos en la última página conocida.
        if (currentPage === Math.max(...visitedPages)) {
          setIsAtEnd(false);
        }
      }

      if (pendingPage === null) return; // página ya conocida, nada que hacer

      if (hasData) {
        // Registrar la nueva página como visitada
        setVisitedPages((prev) =>
          prev.includes(pendingPage)
            ? prev
            : [...prev, pendingPage].sort((a, b) => a - b),
        );
        setPendingPage(null);
      } else {
        // No hay datos → revertir a la última página con datos
        const lastGoodPage = visitedPages[visitedPages.length - 1] ?? 1;
        setCurrentPage(lastGoodPage);
        setPendingPage(null);
        setIsAtEnd(true);
      }
    },
    [pendingPage, visitedPages, pageSize, currentPage],
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
  };
}
