import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { Loader2, Pencil } from "lucide-react";
import { useUpdateUserMutation } from "../hooks/use-update-user";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { ListUser } from "../types/users";

interface UpdateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: ListUser | null;
}


const schema = yup.object({
    username: yup.string().required("El usuario es obligatorio"),
    email: yup.string().required("El correo es obligatorio"),
    firstName: yup.string().required("El nombre es obligatorio").min(5, "El nombre debe tener al menos 5 caracteres"),
    lastName: yup.string().required("El apellido es obligatorio").min(5, "El apellido debe tener al menos 5 caracteres"),
    enabled: yup.boolean().default(true),
}).required();

export function UpdateUserModal({ open, onOpenChange, user }: UpdateUserModalProps) {
    const { mutate: updateUser, isPending } = useUpdateUserMutation();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<{
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        enabled: boolean;
    }>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: user?.username || "",
            email: user?.email || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            enabled: user?.enabled ?? true
        }
    });

    const onSubmit = handleSubmit((data) => {
        if (!user) return;

        const payload: any = {
            id: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            enabled: data.enabled
        };

        updateUser(payload, {
            onSuccess: (data) => {
                if (data?.success) {
                    onOpenChange(false);
                }
            }
        });
    })


    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={() => { onOpenChange(false); reset(); }}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 bg-primary/80 text-white">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Pencil className="w-5 h-5" /> Editar Usuario
                    </DialogTitle>
                    <p className="text-secondary text-sm opacity-90">Modifica los datos del usuario @{user.username}</p>
                </DialogHeader>

                <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Username & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username_edit" className="text-sm font-semibold">Usuario (Username)</Label>
                            <Input
                                placeholder="Usuario"
                                id="username_edit"
                                {...register("username")}
                                className={errors.username ? "border-red-500" : ""}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email_edit" className="text-sm font-semibold">Correo Electrónico</Label>
                            <div className="relative">
                                <Input
                                    placeholder="Correo electrónico"
                                    id="email_edit"
                                    type="email"
                                    className={errors.email ? "border-red-500" : ""}
                                    {...register("email")}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName_edit" className="text-sm font-semibold">Nombre</Label>
                            <Input
                                placeholder="Nombre"
                                id="firstName_edit"
                                {...register("firstName")}
                                className={errors.firstName ? "border-red-500" : ""}
                                required
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName_edit" className="text-sm font-semibold">Apellido</Label>
                            <Input
                                placeholder="Apellido"
                                id="lastName_edit"
                                {...register("lastName")}
                                className={errors.lastName ? "border-red-500" : ""}
                                required
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Checkbox: Enabled */}
                    <div className="flex gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled_edit"
                                {...register("enabled")}
                            />
                            <Label htmlFor="enabled_edit" className="text-sm cursor-pointer">Usuario Habilitado</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                        <Button
                            type="button"
                            variant="secondary" className="px-8 transition-all hover:bg-gray-100"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-10 bg-primary hover:bg-primary/80 text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
