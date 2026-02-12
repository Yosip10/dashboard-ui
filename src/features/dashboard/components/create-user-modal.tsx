import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useCreateUserMutation } from "../hooks/use-create-user";
import { toast } from "sonner";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { mutate: createUser, isPending } = useCreateUserMutation();

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        enabled: true,
        emailVerified: true,
        password: "",
        temporaryPassword: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            toast.error("Por favor completa los campos obligatorios.");
            return;
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            enabled: formData.enabled,
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailVerified: formData.emailVerified,
            credentials: [
                {
                    type: "password",
                    value: formData.password,
                    temporary: formData.temporaryPassword
                }
            ]
        };

        createUser(payload, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    username: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                    enabled: true,
                    emailVerified: true,
                    password: "",
                    temporaryPassword: false
                });

            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 bg-primary/80 text-white">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5" /> Crear Nuevo Usuario
                    </DialogTitle>
                    <p className="text-secondary text-sm opacity-90">Ingresa los datos para registrar un nuevo usuario en el sistema.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Username & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold">Usuario (Username)</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="ej. usuario.apigw"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="pl-9"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold">Nombre</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Nombre"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold">Apellido</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Apellido"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-3 pt-2 border-t border-border">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" /> Contraseña Inicial
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña segura"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="temporaryPassword"
                                checked={formData.temporaryPassword}
                                onCheckedChange={(checked) => handleCheckboxChange("temporaryPassword", checked as boolean)}
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
                                checked={formData.enabled}
                                onCheckedChange={(checked) => handleCheckboxChange("enabled", checked as boolean)}
                            />
                            <Label htmlFor="enabled" className="text-sm cursor-pointer">Usuario Habilitado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="emailVerified"
                                checked={formData.emailVerified}
                                onCheckedChange={(checked) => handleCheckboxChange("emailVerified", checked as boolean)}
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
