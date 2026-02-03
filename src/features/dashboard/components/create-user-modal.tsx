import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Camera, User, Mail, Phone, Fingerprint, MapPin, Loader2 } from "lucide-react";
import { useCreateUserMutation } from "../hooks/use-create-user";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { mutate: createUser, isPending } = useCreateUserMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        typeDocuemnt: "1",
        cc: "",
        gener: "Masculino",
        celphone: "",
        email: "",
        addres: "",
    });

    const [picture, setPicture] = useState<{ src: string; name: string }>({
        src: "",
        name: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicture({
                    src: reader.result as string,
                    name: file.name,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            typeRequest: 1,
            observation: "",
            asing_to: "",
            dataUserModel: {
                reference: 0,
                email: formData.email,
                cc: formData.cc,
                enable: true,
                name: formData.name,
                lastname: formData.lastname,
                adviserCode: "",
                adviseDocument: "",
                gener: formData.gener,
                celphone: formData.celphone,
                birthDate: new Date().toISOString(),
                picture: picture.src ? picture : { src: "", name: "" },
                idBranch: "",
                typeDocuemnt: formData.typeDocuemnt,
                role: "",
                idDepartment: "",
                addres: formData.addres,
                parentCoordinator: "",
                parentCoordinatorName: ""
            }
        };

        createUser(payload, {
            onSuccess: (data) => {
                if (data.success) {
                    onOpenChange(false);
                    // Reset form
                    setFormData({
                        name: "",
                        lastname: "",
                        typeDocuemnt: "1",
                        cc: "",
                        gener: "Masculino",
                        celphone: "",
                        email: "",
                        addres: "",
                    });
                    setPicture({ src: "", name: "" });
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 bg-primary/80 text-white">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5" /> Crear Nuevo Usuario
                    </DialogTitle>
                    <p className="text-secondary text-sm opacity-90">Completa la información para registrar una nueva solicitud de usuario.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-border/50">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-lg transition-transform group-hover:scale-105">
                                <AvatarImage src={picture.src} />
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                    <User className="w-10 h-10" />
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white shadow-md hover:bg-primary/80 transition-colors"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Imagen del Avatar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Nombre
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Ej. Juan"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="text-sm font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Apellidos
                                </Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Ej. Pérez"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    Tipo de Documento
                                </Label>
                                <Select
                                    value={formData.typeDocuemnt}
                                    onValueChange={(v) => handleSelectChange("typeDocuemnt", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Cédula de Ciudadanía</SelectItem>
                                        <SelectItem value="2">Cédula de Extranjería</SelectItem>
                                        <SelectItem value="3">Pasaporte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cc" className="text-sm font-semibold flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4 text-primary" /> Número de Documento
                                </Label>
                                <Input
                                    id="cc"
                                    name="cc"
                                    placeholder="12345678"
                                    value={formData.cc}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    Género
                                </Label>
                                <Select
                                    value={formData.gener}
                                    onValueChange={(v) => handleSelectChange("gener", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Masculino">Masculino</SelectItem>
                                        <SelectItem value="Femenino">Femenino</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="celphone" className="text-sm font-semibold flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary" /> Teléfono Móvil
                                </Label>
                                <Input
                                    id="celphone"
                                    name="celphone"
                                    placeholder="300 123 4567"
                                    value={formData.celphone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary" /> Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="addres" className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Dirección
                                </Label>
                                <Input
                                    id="addres"
                                    name="addres"
                                    placeholder="Calle 123 # 45-67"
                                    value={formData.addres}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
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
