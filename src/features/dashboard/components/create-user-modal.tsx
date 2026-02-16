import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useCreateUserMutation } from "../hooks/use-create-user";
import { toast } from "sonner";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const schema = yup.object({
    username: yup.string().required("El usuario es obligatorio"),
    email: yup.string().required("El correo es obligatorio"),
    firstName: yup.string().required("El nombre es obligatorio").min(5, "El nombre debe tener al menos 5 caracteres"),
    lastName: yup.string().required("El apellido es obligatorio").min(5, "El apellido debe tener al menos 5 caracteres"),
    password: yup.string().required("La contraseña es obligatoria").min(8, "La contraseña debe tener al menos 8 caracteres"),
    temporaryPassword: yup.boolean().default(false),
    enabled: yup.boolean().default(true),
    emailVerified: yup.boolean().default(true),
}).required();

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { mutate: createUser, isPending } = useCreateUserMutation();

    // 2. Inicializar useForm con valores por defecto
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            temporaryPassword: false,
            enabled: true,
            emailVerified: true,
        },
        resolver: yupResolver(schema),
    });

    const onSubmit = handleSubmit((data) => {
        if (!data.username || !data.email || !data.password) {
            return toast.error("Todos los campos con obligatorios");
        }
        createUser({
            username: data.username,
            email: data.email,
            enabled: data.enabled,
            firstName: data.firstName,
            lastName: data.lastName,
            emailVerified: data.emailVerified,
            credentials: [
                {
                    type: "password",
                    value: data.password,
                    temporary: data.temporaryPassword
                }
            ]
        });
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 bg-primary/80 text-white">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5" /> Crear Nuevo Usuario
                    </DialogTitle>
                    <p className="text-secondary text-sm opacity-90">Ingresa los datos para registrar un nuevo usuario en el sistema.</p>
                </DialogHeader>

                <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Username & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold">Usuario (Username)</Label>
                            <Input
                                {...register("username")}
                                name="username"
                                placeholder="ej. usuario.apigw"
                                className={errors.username ? "border-red-500" : ""}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className={errors.email ? "border-red-500 pl-9" : "pl-9"}
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
                            <Label htmlFor="firstName" className="text-sm font-semibold">Nombre</Label>
                            <Input
                                {...register("firstName")}
                                placeholder="Nombre"
                                className={errors.firstName ? "border-red-500" : ""}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold">Apellido</Label>
                            <Input
                                {...register("lastName")}
                                placeholder="Apellido"
                                className={errors.lastName ? "border-red-500" : ""}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-3 pt-2 border-t border-border">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" /> Contraseña Inicial
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña segura"
                            className={errors.password ? "border-red-500" : ""}
                            {...register("password")}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="temporaryPassword"
                                {...register("temporaryPassword")}
                            />
                            <Label htmlFor="temporaryPassword" className="text-xs font-normal cursor-pointer">
                                ¿Contraseña temporal? (El usuario deberá cambiarla al iniciar sesión)
                            </Label>
                        </div>
                    </div>

                    {/* Checkboxes: Enabled & Email Verified */}
                    <div className="flex gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled"
                                {...register("enabled")}
                            />
                            <Label htmlFor="enabled" className="text-sm cursor-pointer">Usuario Habilitado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="emailVerified"
                                {...register("emailVerified")}
                            />
                            <Label htmlFor="emailVerified" className="text-sm cursor-pointer">Email Verificado</Label>
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
                                    Creando...
                                </>
                            ) : (
                                "Crear Usuario"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
