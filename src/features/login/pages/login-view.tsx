
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { useLoginMutation } from "../hooks/use-login";
import { toast } from "sonner";
import { useTenant } from "@/shared/context/TenantContext";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


// 1. Esquema alineado con los nombres del input
const schema = yup.object({
    accountId: yup.string().required("El ID de cuenta es obligatorio"),
    username: yup.string().required("El usuario es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria"),
    rememberMe: yup.boolean().default(false),
}).required();

export function LoginView() {
    const loginMutation = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const { tenantConfig } = useTenant()
    const isPending = loginMutation.isPending;
    // 2. Inicializar useForm con valores por defecto
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            accountId: "TuyaQA",
            username: "",
            password: "",
            rememberMe: false,
        }
    });
    const rememberMeValue = watch("rememberMe");
    // 3. Cargar datos recordados directamente al formulario
    useEffect(() => {
        const remembered = localStorage.getItem("remember");
        if (remembered) {
            try {
                const { username, accountId } = JSON.parse(remembered);
                setValue("username", username);
                setValue("accountId", accountId);
                setValue("rememberMe", true);
            } catch (e) {
                localStorage.removeItem("remember");
            }
        }
    }, [setValue]);


    const onSubmit = handleSubmit((data) => {


        if (!data.accountId || !data.username || !data.password) {
            return toast.error("Todos los campos con obligatorios");
        }
        console.log(data)
        loginMutation.mutate({
            username: data.username,
            password: data.password,
            accountId: data.accountId,
            rememberMe: data.rememberMe
        });
    })




    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Primary animated gradient blob */}
                <div
                    className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--ring) 50%, var(--ring) 100%)",
                        top: "-10%",
                        right: "-10%",
                        animation: "float 20s ease-in-out infinite",
                    }}
                />

                {/* Secondary animated gradient blob */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
                    style={{
                        background:
                            "var(--primary)",
                        bottom: "-15%",
                        left: "-10%",
                        animation: "float 25s ease-in-out infinite reverse",
                    }}
                />

                {/* Tertiary subtle accent blob */}
                <div
                    className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                    style={{
                        background: "var(--primary)",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        animation: "pulse 15s ease-in-out infinite",
                    }}
                />

                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>


            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src={tenantConfig?.logo.url} alt="Logo" width={tenantConfig?.logo.width} height={tenantConfig?.logo.height} className="mb-4 m-auto" />
                    <h1 className="text-2xl font-bold text-foreground">
                        Bienvenidos
                    </h1>
                    <p className="text-foreground mt-1">Plataforma de gestión de entidades, identidad y
                        cumplimiento de última generación</p>
                </div>

                {/* Login Card */}
                <Card className="border-3 border-gray-100 shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-background/80">
                    <CardContent className="p-8">
                        <form onSubmit={onSubmit} className="space-y-5">
                            {/* Usuario */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium">
                                    Usuario
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        {...register("username")} // Usar el nombre correcto
                                        placeholder="Ingrese su usuario"
                                        className={errors.username ? "border-red-500 pl-9 py-5" : "pl-9 py-5"}
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")} // Usar el nombre correcto
                                        placeholder="Ingrese su contraseña"
                                        className={errors.password ? "border-red-500 pl-9 py-5" : "pl-9 py-5"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Recordarme y Olvidar Contraseña */}
                            <div className="flex items-center flex-wrap justify-center md:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="rememberMe"
                                        checked={rememberMeValue}
                                        onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                                    />
                                    <Label
                                        htmlFor="rememberMe"
                                        className="text-sm text-muted-foreground cursor-pointer"
                                    >
                                        Recordarme
                                    </Label>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:text-primary font-medium transition-colors"
                                >
                                    Olvidé mi contraseña
                                </button>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-primary hover:bg-primary/80 w-full h-12 shadow-lg shadow-primary/25 transition-all duration-300 text-base font-medium"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Ingresando...
                                    </div>
                                ) : (
                                    "Ingresar"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    © 2025 Ado Technologies. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
