import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { User, Mail, Calendar, MapPin, Phone, Shield, UserCheck, UserX, Fingerprint } from "lucide-react"
import type { ListUser } from "../types/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

interface UserDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: ListUser | null
}

export function UserDetailsModal({ open, onOpenChange, user }: UserDetailsModalProps) {
    if (!user) return null

    const fullName = `${user.firstName} ${user.lastName}`
    const userInitial = user.firstName?.charAt(0) || user.username?.charAt(0) || "U"
    const picture = user.attributes?.picture?.[0]

    const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold truncate capitalize">{value || "No especificado"}</p>
            </div>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 sm:max-w-2xl border-0 shadow-2xl overflow-hidden rounded-xl h-[90%]">
                {/* Banner Decorativo */}
                <div className="h-32 bg-primary relative">
                    <div className="absolute -bottom-12 left-8">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                            <AvatarImage src={picture} alt={fullName} />
                            <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                                {userInitial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute bottom-4 right-8">
                        <Badge className={user.enabled ? "bg-green-500/20 text-green-100 border-green-500/30 backdrop-blur-md" : "bg-red-500/20 text-red-400 border-red-500/30 backdrop-blur-md"}>
                            {user.enabled ? (
                                <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Activo</span>
                            ) : (
                                <span className="flex items-center gap-1"><UserX className="w-3 h-3" /> Inactivo</span>
                            )}
                        </Badge>
                    </div>
                </div>

                {/* Header Info */}
                <div className="mt-14 px-8 pb-4 border-b border-border/50">
                    <DialogTitle className="sr-only">
                        Detalles del Usuario: {fullName}
                    </DialogTitle>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
                        <p className="text-muted-foreground font-medium">@{user.username}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-8">
                        {/* Seccion: Roles */}
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Roles Asignados
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                            {role.name.replace("ROLE-", "")}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Sin roles asignados</p>
                                )}
                            </div>
                        </section>

                        {/* Seccion: Info Personal */}
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={Mail} label="Correo Electrónico" value={user.email} />
                                <DetailItem icon={Phone} label="Teléfono" value={user.attributes?.phone_number?.[0]} />
                                <DetailItem icon={Calendar} label="Fecha de Nacimiento" value={user.attributes?.birthdate?.[0]} />
                                <DetailItem icon={Fingerprint} label="Tipo de Documento" value={user.attributes?.typeDocuemnt?.[0]} />
                            </div>
                        </section>

                        {/* Seccion: Ubicación y Otros */}
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Ubicación y Otros
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={MapPin} label="Dirección" value={user.attributes?.addres?.[0]} />
                                <DetailItem icon={User} label="Género" value={user.attributes?.gender?.[0]} />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 flex justify-end">
                    <Button onClick={() => onOpenChange(false)} variant="secondary" className="px-8 transition-all hover:bg-gray-100">
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
