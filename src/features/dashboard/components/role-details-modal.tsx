import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Shield, Users, Layers, CheckCircle, XCircle } from "lucide-react";

interface RoleUser {
    initials: string;
    color: string;
}

interface Role {
    id: string;
    name: string;
    users: RoleUser[];
    modules: string[];
    active: boolean;
}

interface RoleDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
}

export function RoleDetailsModal({
    open,
    onOpenChange,
    role,
}: RoleDetailsModalProps) {
    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Detalles del Rol</DialogTitle>
                            <DialogDescription>
                                Identificador: <span className="font-mono text-foreground font-medium">{role.id}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Main Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4 text-primary" />
                                Nombre del Rol
                            </div>
                            <p className="font-medium text-lg">{role.name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {role.active ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-primary" />
                                )}
                                Estado
                            </div>
                            <Badge
                                variant={role.active ? "default" : "secondary"}
                                className={role.active ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                                {role.active ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Users */}
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Users className="w-4 h-4" />
                                Usuarios Asignados
                            </div>
                            {role.users.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.users.map((user, i) => (
                                        <Avatar
                                            key={i}
                                            className="w-10 h-10 border-2 border-background ring-1 ring-border"
                                        >
                                            <AvatarFallback className={`${user.color} text-white text-sm`}>
                                                {user.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    No hay usuarios asignados a este rol.
                                </p>
                            )}
                        </div>

                        {/* Modules */}
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Layers className="w-4 h-4" />
                                Módulos con Acceso
                            </div>
                            {role.modules.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.modules.map((module) => (
                                        <Badge
                                            key={module}
                                            variant="secondary"
                                            className="px-3 py-1 bg-background border shadow-sm"
                                        >
                                            {module}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    Este rol no tiene acceso a módulos.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
