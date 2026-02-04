
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

const flowRequests = [
  {
    id: "FLW001",
    createdAt: "2025-01-15 09:30",
    docType: "Factura",
    document: "FAC-2025-0001",
    key: "abc123xyz",
    url: "https://api.example.com/flow/abc123xyz",
    status: "activo",
  },
  {
    id: "FLW002",
    createdAt: "2025-01-14 14:22",
    docType: "Orden de Compra",
    document: "OC-2025-0042",
    key: "def456uvw",
    url: "https://api.example.com/flow/def456uvw",
    status: "pendiente",
  },
  {
    id: "FLW003",
    createdAt: "2025-01-13 11:45",
    docType: "Nota de Crédito",
    document: "NC-2025-0015",
    key: "ghi789rst",
    url: "https://api.example.com/flow/ghi789rst",
    status: "rechazado",
  },
  {
    id: "FLW004",
    createdAt: "2025-01-12 16:30",
    docType: "Factura",
    document: "FAC-2025-0002",
    key: "jkl012opq",
    url: "https://api.example.com/flow/jkl012opq",
    status: "activo",
  },
  {
    id: "FLW005",
    createdAt: "2025-01-11 10:15",
    docType: "Orden de Compra",
    document: "OC-2025-0043",
    key: "mno345lmn",
    url: "https://api.example.com/flow/mno345lmn",
    status: "pendiente",
  },
];

const statusStyles = {
  activo: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  pendiente: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
  rechazado: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
};

export function FlowRequestsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <FlowRequestModal open={modalOpen} onOpenChange={setModalOpen} />

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
        <div className="overflow-hidden rounded-xs">
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
                {flowRequests.map((request, index) => (
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
                                <Check className="w-3 h-3 text-green-500" />
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
                      <div className="flex items-center gap-2 max-w-[200px]">
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
                                  <Check className="w-3 h-3 text-green-500" />
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
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>
      </div>
    </TooltipProvider>
  );
}
