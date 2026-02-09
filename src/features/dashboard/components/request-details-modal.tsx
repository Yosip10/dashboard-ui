import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Copy, ExternalLink, Check, Calendar, FileText, Key, Globe, Activity } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

interface FlowRequest {
    id: string;
    createdAt: string;
    docType: string;
    document: string;
    key: string;
    url: string;
    status: string;
}

interface RequestDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: FlowRequest | null;
}

const statusStyles = {
    activo: "bg-green-500/10 text-green-600 border-green-200",
    pendiente: "bg-amber-500/10 text-amber-600 border-amber-200",
    rechazado: "bg-red-500/10 text-red-600 border-red-200",
};

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Detalles de Solicitud</DialogTitle>
                            <DialogDescription>
                                ID: <span className="font-mono text-foreground font-medium">{request.id}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Main Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Fecha Creación
                            </div>
                            <p className="font-medium">{request.createdAt}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Activity className="w-4 h-4" />
                                Estado
                            </div>
                            <Badge
                                variant="outline"
                                className={statusStyles[request.status as keyof typeof statusStyles] || ""}
                            >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                        {/* Document Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo Documento</span>
                                <p className="font-medium">{request.docType}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No. Documento</span>
                                <p className="font-medium font-mono">{request.document}</p>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Keys & URLs */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Key className="w-4 h-4" />
                                    Clave de Acceso
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-background border rounded px-3 py-1.5 font-mono text-sm">
                                        {request.key}
                                    </code>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(request.key, "key")}
                                                    className="h-8 w-8 hover:text-white"
                                                >
                                                    {copiedId === "key" ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Copiar clave</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Globe className="w-4 h-4" />
                                    URL de Seguimiento
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-background border rounded px-3 py-1.5 font-mono text-sm truncate">
                                        {request.url}
                                    </code>
                                    <div className="flex gap-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(request.url, "url")}
                                                        className="h-8 w-8 hover:text-white"
                                                    >
                                                        {copiedId === "url" ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Copiar URL</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => window.open(request.url, "_blank")}
                                                        className="h-8 w-8 hover:text-white"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Abrir enlace</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
