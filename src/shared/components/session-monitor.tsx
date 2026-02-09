import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/login/store/auth.store";
import { useLoginMutation } from "@/features/login/hooks/use-login";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Timer, Lock } from "lucide-react";

const SessionMonitor = () => {
    const { isAuthenticated, logout, refreshExpiresAt, user } = useAuthStore();
    const { mutate: login, isPending } = useLoginMutation({ redirect: false });
    const ALERT_THRESHOLD = 60; // Mostrar alerta cuando queden 60 segundos
    const [showAlert, setShowAlert] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ALERT_THRESHOLD);
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !refreshExpiresAt) return;

        // Si el tiempo de expiración se actualiza a un futuro lejano, cerramos la alerta
        const now = Date.now();
        if (refreshExpiresAt - now > ALERT_THRESHOLD * 1000) {
            setShowAlert(false);
            setPassword("");
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = refreshExpiresAt - now;
            const secondsLeft = Math.floor(diff / 1000);

            if (secondsLeft <= ALERT_THRESHOLD && secondsLeft > 0) {
                setShowAlert(true);
                setTimeLeft(secondsLeft);
            }

            if (secondsLeft <= 0) {
                clearInterval(interval);
                setShowAlert(false);
                logout();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated, refreshExpiresAt, logout, ALERT_THRESHOLD]);


    const handleLogout = () => {
        setShowAlert(false);
        setPassword("");
        logout();
    };

    const handleMaintainSession = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!user || !password) return;

        login({
            username: user.username,
            password: password,
            accountId: user.realm,
            rememberMe: true
        });
    };

    if (!showAlert) return null;

    return (
        <Dialog open={showAlert} onOpenChange={(open) => !open && !isPending && setShowAlert(false)}>
            <DialogContent className="max-w-md" showCloseButton={false}>
                <form onSubmit={handleMaintainSession}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Timer className="h-6 w-6 text-primary animate-bounce" />
                            Tu sesión va a caducar
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            Para proteger tu información, la sesión se cerrará en{" "}
                            <span className="font-bold text-primary tabular-nums">
                                {timeLeft} segundos
                            </span>.
                            Introduce tu contraseña para continuar trabajando.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-2">
                        <Label htmlFor="session-password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Tu contraseña"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isPending}
                                autoFocus
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-row sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleLogout}
                            disabled={isPending}
                        >
                            Cerrar sesión
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !password}
                            className="bg-primary hover:bg-primary/80 text-white min-w-35"
                        >
                            {isPending ? "Validando..." : "Mantener sesión"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default SessionMonitor