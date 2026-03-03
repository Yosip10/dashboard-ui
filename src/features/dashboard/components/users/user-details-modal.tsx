import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Shield,
  UserCheck,
  UserX,
  Fingerprint,
  Clock,
  Hash,
  BookUser,
  BadgeCheck,
  BadgeX,
  Key,
  Settings2,
} from "lucide-react";
import type { ListUser } from "../../types/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ListUser | null;
}

/* ── Helpers ─────────────────────────────────────────────── */
function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </h3>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: any;
  label: string;
  value: string | undefined | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className={`text-sm truncate ${mono ? "font-mono" : ""}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function BooleanRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        {value ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <BadgeCheck className="w-3.5 h-3.5" /> Sí
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <BadgeX className="w-3.5 h-3.5" /> No
          </span>
        )}
      </div>
    </div>
  );
}

function formatTimestamp(ts: number | undefined | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Component ───────────────────────────────────────────── */
export function UserDetailsModal({
  open,
  onOpenChange,
  user,
}: UserDetailsModalProps) {
  if (!user) return null;

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username;
  const userInitial =
    user.firstName?.charAt(0) || user.username?.charAt(0) || "U";
  const picture = user.attributes?.picture?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 w-full sm:max-w-xl border-0 shadow-2xl overflow-hidden rounded-xl">
        {/* ── Banner ── */}
        <div className="h-28 bg-primary relative shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/70" />
          <div className="absolute -bottom-10 left-6">
            <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
              <AvatarImage src={picture} alt={fullName} />
              <AvatarFallback className="text-xl font-bold bg-primary text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-3 right-4">
            <Badge
              className={
                user.enabled
                  ? "bg-green-500/20 text-green-100 border-green-500/30 backdrop-blur-md text-xs"
                  : "bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-md text-xs"
              }
            >
              {user.enabled ? (
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Activo
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <UserX className="w-3 h-3" /> Inactivo
                </span>
              )}
            </Badge>
          </div>
        </div>

        {/* ── User title ── */}
        <div className="mt-11 px-6 pb-3 border-b border-border/50 shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground leading-tight">
            {fullName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium">
            @{user.username}
          </p>
        </div>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto max-h-[55vh]">
          <div className="px-6 py-5 space-y-6">
            {/* Roles */}
            <section>
              <SectionLabel icon={Shield} label="Roles Asignados" />
              {user.roles && user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <Badge
                      key={role.id}
                      variant="secondary"
                      className="px-2.5 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs"
                    >
                      {role.name.replace(/^(ROLE[- ]|MODULE[- ])/i, "")}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Sin roles asignados
                </p>
              )}
            </section>

            {/* Información personal */}
            <section>
              <SectionLabel icon={User} label="Información Personal" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <DetailRow
                  icon={Mail}
                  label="Correo Electrónico"
                  value={user.email}
                />
                <DetailRow
                  icon={Phone}
                  label="Teléfono"
                  value={user.attributes?.phone_number?.[0]}
                />
                <DetailRow
                  icon={Calendar}
                  label="Fecha de Nacimiento"
                  value={user.attributes?.birthdate?.[0]}
                />
                <DetailRow
                  icon={Fingerprint}
                  label="Tipo de Documento"
                  value={user.attributes?.typeDocuemnt?.[0]}
                />
                <DetailRow
                  icon={Hash}
                  label="Nro. Documento"
                  value={user.attributes?.adviseDocument?.[0]}
                />
                <DetailRow
                  icon={User}
                  label="Género"
                  value={user.attributes?.gender?.[0]}
                />
              </div>
            </section>

            {/* Ubicación */}
            <section>
              <SectionLabel icon={MapPin} label="Ubicación" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <DetailRow
                  icon={MapPin}
                  label="Dirección"
                  value={user.attributes?.addres?.[0]}
                />
                <DetailRow
                  icon={BookUser}
                  label="ID Sucursal"
                  value={user.attributes?.idBranch?.[0]}
                />
                <DetailRow
                  icon={MapPin}
                  label="ID Departamento"
                  value={user.attributes?.idDepartment?.[0]}
                />
              </div>
            </section>

            {/* Asesor / Coordinador */}
            <section>
              <SectionLabel icon={Settings2} label="Información Laboral" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <DetailRow
                  icon={Key}
                  label="Código Asesor"
                  value={user.attributes?.adviser_code?.[0]}
                />
                <DetailRow
                  icon={User}
                  label="Coordinador"
                  value={user.attributes?.parentCoordinatorName?.[0]}
                />
                <DetailRow
                  icon={Hash}
                  label="ID Coordinador"
                  value={user.attributes?.parentCoordinator?.[0]}
                  mono
                />
              </div>
            </section>

            {/* Cuenta */}
            <section>
              <SectionLabel icon={Shield} label="Estado de la Cuenta" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <BooleanRow
                  icon={BadgeCheck}
                  label="Email Verificado"
                  value={user.emailVerified}
                />
                <BooleanRow
                  icon={BadgeCheck}
                  label="TOTP Habilitado"
                  value={user.totp}
                />
                <DetailRow
                  icon={Clock}
                  label="Registro"
                  value={formatTimestamp(user.createdTimestamp)}
                />
                <DetailRow
                  icon={Clock}
                  label="Última Sesión"
                  value={user.lastSession ?? undefined}
                />
                <DetailRow
                  icon={Hash}
                  label="ID del Usuario"
                  value={user.id}
                  mono
                />
              </div>
            </section>

            {/* Acciones requeridas */}
            {user.requiredActions && user.requiredActions.length > 0 && (
              <section>
                <SectionLabel icon={Key} label="Acciones Requeridas" />
                <div className="flex flex-wrap gap-1.5">
                  {user.requiredActions.map((action) => (
                    <Badge
                      key={action}
                      variant="outline"
                      className="text-xs px-2.5 py-1 border-amber-400/50 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300"
                    >
                      {action}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t border-border/50 flex justify-end shrink-0 bg-muted/10">
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            size="sm"
            className="px-6"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
