import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { Mail, Loader2, Pencil } from "lucide-react";
import { useUpdateUserMutation } from "../hooks/use-update-user";
import type { ListUser } from "../types/users";

interface UpdateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: ListUser | null;
}

export function UpdateUserModal({ open, onOpenChange, user }: UpdateUserModalProps) {
    const { mutate: updateUser, isPending } = useUpdateUserMutation();

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        enabled: true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                enabled: user.enabled ?? true
            });
        }
    }, [user, open]);

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

        if (!user) return;

        const payload: any = {
            id: user.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            enabled: formData.enabled
        };

        updateUser(payload, {
            onSuccess: (data) => {
                if (data?.success) {
                    onOpenChange(false);
                }
            }
        });
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 bg-primary/80 text-white">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Pencil className="w-5 h-5" /> Editar Usuario
                    </DialogTitle>
                    <p className="text-secondary text-sm opacity-90">Modifica los datos del usuario @{user.username}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Username & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username_edit" className="text-sm font-semibold">Usuario (Username)</Label>
                            <Input
                                id="username_edit"
                                name="username"
                                value={formData.username}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email_edit" className="text-sm font-semibold">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email_edit"
                                    name="email"
                                    type="email"
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
                            <Label htmlFor="firstName_edit" className="text-sm font-semibold">Nombre</Label>
                            <Input
                                id="firstName_edit"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName_edit" className="text-sm font-semibold">Apellido</Label>
                            <Input
                                id="lastName_edit"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkbox: Enabled */}
                    <div className="flex gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled_edit"
                                checked={formData.enabled}
                                onCheckedChange={(checked) => handleCheckboxChange("enabled", checked as boolean)}
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
