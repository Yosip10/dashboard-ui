import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Shield } from "lucide-react";
import type { Role } from "../types/roles";

/* ─── Types ─────────────────────────────────────────────── */
interface PermissionRow {
    domain: string;
    submodule: string;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}
type ActionKey = "view" | "create" | "update" | "delete";

/* ─── Parser ─────────────────────────────────────────────── */
function parsePermissions(realmRoles: string[]): PermissionRow[] {
    const map = new Map<string, PermissionRow>();
    realmRoles.forEach((perm) => {
        const match = perm.match(/^PERMISE-([^-]+)-(VIEW|CREATE|UPDATE|DELETE)-SUBMODULE-[^-]+-(.+)$/i);
        if (!match) return;
        const [, domain, action, submodule] = match;
        const key = `${domain}::${submodule}`;
        if (!map.has(key)) {
            map.set(key, { domain, submodule, view: false, create: false, update: false, delete: false });
        }
        const row = map.get(key)!;
        const a = action.toUpperCase();
        if (a === "VIEW") row.view = true;
        if (a === "CREATE") row.create = true;
        if (a === "UPDATE") row.update = true;
        if (a === "DELETE") row.delete = true;
    });
    return Array.from(map.values());
}

/* ─── Constants ─────────────────────────────────────────── */
const ACTIONS: { key: ActionKey; label: string; checkColor: string }[] = [
    { key: "view", label: "Ver", checkColor: "data-[state=checked]:bg-sky-500     data-[state=checked]:border-sky-500" },
    { key: "create", label: "Crear", checkColor: "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" },
    { key: "update", label: "Editar", checkColor: "data-[state=checked]:bg-amber-500   data-[state=checked]:border-amber-500" },
    { key: "delete", label: "Eliminar", checkColor: "data-[state=checked]:bg-rose-500    data-[state=checked]:border-rose-500" },
];

const PALETTE = [
    { pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", pillHover: "bg-violet-200 dark:bg-violet-900/60", dot: "bg-violet-500" },
    { pill: "bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300", pillHover: "bg-blue-200   dark:bg-blue-900/60", dot: "bg-blue-500" },
    { pill: "bg-teal-100   text-teal-700   dark:bg-teal-900/40   dark:text-teal-300", pillHover: "bg-teal-200   dark:bg-teal-900/60", dot: "bg-teal-500" },
    { pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", pillHover: "bg-orange-200 dark:bg-orange-900/60", dot: "bg-orange-500" },
];
const domainColorCache: Record<string, typeof PALETTE[0]> = {};
let colorIdx = 0;
function getDomainColor(domain: string) {
    if (!domainColorCache[domain]) {
        domainColorCache[domain] = PALETTE[colorIdx % PALETTE.length];
        colorIdx++;
    }
    return domainColorCache[domain];
}

/* ─── Props ─────────────────────────────────────────────── */
interface RolePermissionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
}

/* ─── Component ─────────────────────────────────────────── */
export function RolePermissionsModal({ open, onOpenChange, role }: RolePermissionsModalProps) {
    const [rows, setRows] = useState<PermissionRow[]>([]);

    useEffect(() => {
        setRows(role ? parsePermissions(role.realmRoles) : []);
    }, [role]);

    if (!role) return null;

    const roleName = role.name
        .replace(/^MODULE[- ]/i, "")
        .replace(/^\w/, (c) => c.toUpperCase());

    const toggle = (idx: number, action: ActionKey) =>
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [action]: !r[action] } : r)));

    // Group by domain
    const domainGroups: Record<string, { row: PermissionRow; globalIdx: number }[]> = {};
    rows.forEach((row, i) => {
        (domainGroups[row.domain] ??= []).push({ row, globalIdx: i });
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl w-full p-0 gap-0 overflow-hidden">

                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/15 rounded-xl ring-1 ring-primary/20 shrink-0">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold leading-tight">
                                    Gestión de Permisos
                                </DialogTitle>
                                <DialogDescription className="mt-0.5 flex items-center gap-2">
                                    Rol:
                                    <Badge variant="secondary" className="font-medium py-0 text-xs">
                                        {roleName}
                                    </Badge>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* ── Table ── */}
                <div className="overflow-y-auto max-h-[55vh] px-6 py-4">
                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                            <Shield className="w-10 h-10 opacity-25" />
                            <p className="text-sm">Este rol no tiene permisos asignados.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide w-36">
                                        Módulo
                                    </th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide">
                                        Submódulo
                                    </th>
                                    {ACTIONS.map((a) => (
                                        <th key={a.key} className="py-2 px-3 text-center w-20 text-xs font-semibold text-muted-foreground tracking-wide">
                                            {a.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(domainGroups).map(([domain, items]) => {
                                    const color = getDomainColor(domain);
                                    return items.map(({ row, globalIdx }, rowIdx) => (
                                        <tr
                                            key={`${domain}-${row.submodule}`}
                                            className="transition-colors hover:bg-primary/5"
                                        >
                                            {/* Domain pill — rowspan on first row of group */}
                                            {rowIdx === 0 ? (
                                                <td
                                                    rowSpan={items.length}
                                                    className="px-3 py-3 align-middle border-t border-border/50"
                                                >
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-150 ${color.pill}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                                                        {domain}
                                                    </div>
                                                </td>
                                            ) : null}

                                            {/* Submodule name */}
                                            <td className="px-3 py-3 text-foreground/80 border-t border-border/50">
                                                {row.submodule}
                                            </td>

                                            {/* Checkboxes */}
                                            {ACTIONS.map((a) => (
                                                <td key={a.key} className="px-3 py-3 border-t border-border/50 text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            id={`${domain}-${row.submodule}-${a.key}`}
                                                            checked={row[a.key]}
                                                            onCheckedChange={() => toggle(globalIdx, a.key)}
                                                            className={`${a.checkColor} transition-colors`}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                        {rows.length} submódulo{rows.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={() => onOpenChange(false)}>
                            Guardar cambios
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
