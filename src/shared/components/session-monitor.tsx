import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/login/store/auth.store";
import { useRefreshMutation } from "@/features/login/hooks/use-refresh";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Timer } from "lucide-react";

export const SessionMonitor = () => {
    const { isAuthenticated, logout, expiresAt } = useAuthStore();
    const { mutate: refreshSession, isPending } = useRefreshMutation();
    const ALERT_THRESHOLD = 60; // Mostrar alerta cuando queden 60 segundos
    const [showAlert, setShowAlert] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ALERT_THRESHOLD);

    useEffect(() => {
        if (!isAuthenticated || !expiresAt) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiresAt - now;
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
    }, [isAuthenticated, expiresAt, logout, ALERT_THRESHOLD]);



    const handleLogout = () => {
        setShowAlert(false);
        logout();
    };

    const handleMaintainSession = async () => {

        refreshSession(undefined, {
            onSuccess: () => setShowAlert(false),
            onError: () => handleLogout(),
        });
    };

    if (!showAlert) return null;

    return (
        <Dialog open={showAlert} onOpenChange={(open) => !open && setShowAlert(false)}>
            <DialogContent className="max-w-md" showCloseButton={false}>
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
                        ¿Deseas continuar trabajando?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row sm:justify-end gap-3 mt-4">
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                        disabled={isPending}
                    >
                        Cerrar sesión
                    </Button>
                    <Button
                        onClick={handleMaintainSession}
                        disabled={isPending}
                        className="bg-primary hover:bg-primary/80 text-white min-w-[140px]"
                    >
                        {isPending ? "Renovando..." : "Mantener sesión"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};