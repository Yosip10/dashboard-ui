
import { useState } from "react";
import {
  Eye,
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  Check,

} from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { FlowRequestModal } from "../components/flow-request-modal";
import { RequestDetailsModal } from "../components/request-details-modal";
import DeleteRequestAlert from "../components/delete-request-alert";
import { PaginationControls } from "@/shared/components/pagination-controls";
import { Loader2, X } from "lucide-react";
import { MOCK_REQUESTS } from "../data/mock-request";
import { useRequests } from "../hooks/use-requests";
import { useSearch } from "@/shared/hooks";

const statusStyles = {
  activo: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  pendiente: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
  rechazado: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
};

export function FlowRequestsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const { search, column } = useSearch();

  const { data: response, isLoading, isError } = useRequests({
    limit: pageSize,
    skip: (page - 1) * pageSize,
    search,
    column
  }, true);

  const requestsData = response?.data?.requests || [];
  const totalPages = Math.ceil(MOCK_REQUESTS.length / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsSimulatingLoading(true);
      setTimeout(() => {
        setPage(newPage);
        setIsSimulatingLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<(typeof MOCK_REQUESTS)[0] | null>(null);

  const handleViewDetails = (request: (typeof MOCK_REQUESTS)[0]) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (request: (typeof MOCK_REQUESTS)[0]) => {
    setSelectedRequest(request);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando solicitudes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <X className="w-8 h-8 mr-2" />
        <span>Error al cargar las solicitudes.</span>
      </div>
    );
  }

  return (
    <div>
      <DeleteRequestAlert
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        request={selectedRequest}
      />
      <TooltipProvider>
        <div className="space-y-6">
          <FlowRequestModal open={modalOpen} onOpenChange={setModalOpen} />
          <RequestDetailsModal open={detailsModalOpen} onOpenChange={setDetailsModalOpen} request={selectedRequest} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Solicitudes de Flujos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestiona las solicitudes de flujos de documentos
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-primary hover:bg-primary/80 shadow-lg shadow-primary/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Solicitud
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xs relative">
            {isSimulatingLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                <div className="bg-background p-4 rounded-full shadow-lg border border-primary/20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </div>
            )}
            <CardHeader className="py-3 bg-muted-foreground/5 rounded mt-2 rounded-t-lg border-t border-l border-r border-gray-200">
              <CardTitle className="text-xl">Lista de Solicitudes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold pl-5">ID</TableHead>
                    <TableHead className="font-semibold">
                      Fecha Creación
                    </TableHead>
                    <TableHead className="font-semibold ">Tipo Doc.</TableHead>
                    <TableHead className="font-semibold">Documento</TableHead>
                    <TableHead className="font-semibold">Clave</TableHead>
                    <TableHead className="font-semibold">URL Solicitud</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestsData.length ? requestsData.map((request, index) => (
                    <TableRow
                      key={request.id}
                      className="hover:bg-primary/5 transition-colors duration-150"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-mono text-sm text-muted-foreground pl-5">
                        {request.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.createdAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {request.docType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {request.document}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {request.key}
                          </code>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                onClick={() =>
                                  copyToClipboard(
                                    request.key,
                                    `key-${request.id}`,
                                  )
                                }
                              >
                                {copiedId === `key-${request.id}` ? (
                                  <Check className="w-3 h-3 text-primary" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedId === `key-${request.id}`
                                ? "¡Copiado!"
                                : "Copiar clave"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-50">
                          <span className="truncate text-xs text-muted-foreground">
                            {request.url}
                          </span>
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                  onClick={() =>
                                    copyToClipboard(
                                      request.url,
                                      `url-${request.id}`,
                                    )
                                  }
                                >
                                  {copiedId === `url-${request.id}` ? (
                                    <Check className="w-3 h-3 text-primary" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {copiedId === `url-${request.id}`
                                  ? "¡Copiado!"
                                  : "Copiar URL"}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                  onClick={() =>
                                    window.open(request.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Abrir URL</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            statusStyles[
                            request.status as keyof typeof statusStyles
                            ]
                          }
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                            onClick={() => handleDelete(request)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No se encontraron solicitudes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={MOCK_REQUESTS.length}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </TooltipProvider>
    </div>

  );
}
