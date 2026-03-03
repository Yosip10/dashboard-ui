import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Copy,
  ExternalLink,
  Check,
  Calendar,
  FileText,
  Key,
  Globe,
  Activity,
  Hash,
  User,
  RefreshCw,
  Layers,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import type { FlowRequest } from "../../types/requests";
import { formatDate, getStatus } from "@/shared/utils";

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: FlowRequest | null;
}

const statusStyles: Record<number, string> = {
  1: "bg-green-500/10 text-green-600 border-green-300 dark:border-green-700 dark:text-green-400",
  2: "bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700 dark:text-amber-400",
  3: "bg-red-500/10 text-red-600 border-red-300 dark:border-red-700 dark:text-red-400",
};

/* ── Helpers ──────────────────────────────────────────────── */
function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
      <Icon className="w-3 h-3" />
      {label}
    </p>
  );
}

function DataCell({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: any;
  label: string;
  value: string | number | undefined | null;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <SectionLabel icon={icon} label={label} />
      <p className={`text-sm truncate ${mono ? "font-mono" : ""}`}>
        {value !== undefined && value !== null && value !== ""
          ? String(value)
          : "—"}
      </p>
    </div>
  );
}

function UrlRow({
  label,
  url,
  copyId,
  copiedId,
  onCopy,
}: {
  label: string;
  url: string;
  copyId: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  if (!url) return null;
  return (
    <div className="space-y-1.5">
      <SectionLabel icon={Globe} label={label} />
      <div className="flex items-center gap-2 min-w-0">
        <code className="flex-1 bg-muted/40 border border-border/60 rounded-md px-2.5 py-1.5 font-mono text-xs truncate min-w-0">
          {url}
        </code>
        <div className="flex gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopy(url, copyId)}
                className="h-7 w-7 hover:text-white hover:bg-primary shrink-0"
              >
                {copiedId === copyId ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copiar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(url, "_blank")}
                className="h-7 w-7 hover:text-white hover:bg-primary shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Abrir enlace</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────── */
export function RequestDetailsModal({
  open,
  onOpenChange,
  request,
}: RequestDetailsModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!request) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* ── Header (fijo) ── */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60 bg-muted/30 shrink-0">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-xl ring-1 ring-primary/20 shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold leading-tight">
                  Detalles de Solicitud
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs font-mono break-all">
                  Código: {request.code} · Proyecto: {request.project}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto max-h-[60vh] px-5 py-4 space-y-5">
          {/* Fila superior: Fecha + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <SectionLabel icon={Calendar} label="Fecha de Creación" />
              <p className="text-xs">{formatDate(request.createDate)}</p>
            </div>
            <div className="space-y-1">
              <SectionLabel icon={Activity} label="Estado" />
              <Badge
                variant="outline"
                className={`text-xs ${statusStyles[request.state] ?? ""}`}
              >
                {getStatus(request.state)}
              </Badge>
            </div>
          </div>

          {/* Info del documento */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DataCell
                icon={FileText}
                label="Tipo Documento"
                value={request.typeDocument}
              />
              <DataCell
                icon={Hash}
                label="No. Documento"
                value={request.document}
                mono
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DataCell
                icon={Layers}
                label="Tipo de Flujo"
                value={request.flowType}
              />
              <DataCell
                icon={Activity}
                label="Monto de Riesgo"
                value={`$${request.amountRisk ?? 0}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DataCell
                icon={Hash}
                label="Customer ID"
                value={request.customerId}
                mono
              />
              <DataCell
                icon={Layers}
                label="Proyecto"
                value={request.project}
              />
            </div>
          </div>

          {/* Auditoría */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DataCell
                icon={User}
                label="Creado por"
                value={request.createFor}
              />
              <DataCell
                icon={RefreshCw}
                label="Actualizado por"
                value={request.updateFor}
              />
            </div>
          </div>

          {/* Clave de acceso */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
            {/* Key */}
            <div className="space-y-1.5">
              <SectionLabel icon={Key} label="Clave de Acceso" />
              <div className="flex items-center gap-2 min-w-0">
                <code className="flex-1 bg-muted/40 border border-border/60 rounded-md px-2.5 py-1.5 font-mono text-xs truncate min-w-0">
                  {request.key}
                </code>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(request.key, "key")}
                      className="h-7 w-7 hover:text-white hover:bg-primary shrink-0"
                    >
                      {copiedId === "key" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copiar clave</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
            <UrlRow
              label="URL de Proceso"
              url={request.url}
              copyId="url"
              copiedId={copiedId}
              onCopy={copyToClipboard}
            />
            <UrlRow
              label="URL Callback"
              url={request.callBackUrl}
              copyId="callbackUrl"
              copiedId={copiedId}
              onCopy={copyToClipboard}
            />
          </div>
        </div>

        {/* ── Footer (fijo) ── */}
        <div className="px-5 py-3 border-t border-border/60 bg-muted/10 flex justify-end shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
