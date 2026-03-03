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
  Shield,
  Layers,
  GitBranch,
  Box,
  Hash,
  FileText,
  RouteIcon,
  ShieldUser,
} from "lucide-react";
import type { Role } from "../../types/roles";

interface RoleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

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

function PillGroup({
  items,
  colorClass = "",
  emptyText = "Sin datos",
  maxH = false,
}: {
  items: string[];
  colorClass?: string;
  emptyText?: string;
  maxH?: boolean;
}) {
  if (!items || items.length === 0)
    return <p className="text-xs text-muted-foreground italic">{emptyText}</p>;
  return (
    <div
      className={`flex flex-wrap gap-1.5 ${maxH ? "max-h-28 overflow-y-auto pr-1" : ""}`}
    >
      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className={`text-[10px] px-2 py-0.5 font-mono leading-tight ${colorClass}`}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────── */
export function RoleDetailsModal({
  open,
  onOpenChange,
  role,
}: RoleDetailsModalProps) {
  if (!role) return null;

  const roleName = role.name
    .replace(/^(MODULE|ROLE)[- ]/i, "")
    .replace(/^\w/, (c) => c.toUpperCase());

  const description = role.attributes?.description?.[0];

  // Los módulos vinculados pueden venir como JSON strings: '{"name":"MODULE-operaciones","id":"..."}'
  // Parseamos y limpiamos el nombre para mostrarlo de forma legible.
  const rawModulesLinked: string[] = role.attributes?.modulesLinked ?? [];
  const modulesLinked = rawModulesLinked.map((entry) => {
    try {
      const parsed = JSON.parse(entry);
      const rawName: string = parsed?.name ?? entry;
      return rawName
        .replace(/^(MODULE|ROLE)[- ]/i, "")
        .replace(/^\w/, (c) => c.toUpperCase());
    } catch {
      // Si no es JSON válido, limpiar directamente el string
      return entry
        .replace(/^(MODULE|ROLE)[- ]/i, "")
        .replace(/^\w/, (c) => c.toUpperCase());
    }
  });

  const clientRoleEntries = Object.entries(role.clientRoles ?? {}).filter(
    ([, perms]) => perms && perms.length > 0,
  );

  const totalSubGroups = role.subGroups?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        <div className="">
          <DialogHeader className="p-6 bg-primary text-white">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/80 rounded-md ring-2 shrink-0 mt-0.5">
                <ShieldUser className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold leading-tight truncate">
                  {roleName}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs font-mono break-all text-white">
                  ID: {role.id}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto max-h-[60vh] px-5 py-4 space-y-4">
          {/* Nombre completo + Descripción */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <DataCell icon={Shield} label="Nombre del Rol" value={roleName} />
            </div>
            <div>
              <SectionLabel icon={FileText} label="Descripción" />
              <p className="text-sm text-foreground/80">
                {description || (
                  <span className="italic text-muted-foreground">
                    Sin descripción
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Módulos vinculados */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
            <SectionLabel
              icon={Layers}
              label={`Módulos Vinculados (${modulesLinked.length})`}
            />
            <PillGroup
              items={modulesLinked}
              colorClass="bg-primary/10 text-primary border-primary/20"
              emptyText="Sin módulos vinculados"
            />
          </div>

          {/* Client Roles — solo si hay */}
          {clientRoleEntries.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
              <SectionLabel icon={Box} label="Roles de Cliente" />
              {clientRoleEntries.map(([client, perms]) => (
                <div key={client} className="space-y-1.5">
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    {client}
                  </p>
                  <PillGroup
                    items={perms}
                    colorClass="bg-primary/10 text-primary border-primary/20"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SubGrupos */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
            <SectionLabel
              icon={GitBranch}
              label={`SubGrupos (${totalSubGroups})`}
            />
            <PillGroup
              items={role.subGroups ?? []}
              colorClass="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300"
              emptyText="Sin subgrupos"
            />
          </div>

          {/* Path completo */}
          {role.path && (
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-1">
              <SectionLabel icon={RouteIcon} label="Path Completo" />
              <code className="block text-xs font-mono text-foreground/70 break-all">
                {role.path}
              </code>
            </div>
          )}
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
