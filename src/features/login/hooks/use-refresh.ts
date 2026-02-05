import { useMutation } from "@tanstack/react-query";
import { refreshService } from "../api/auth.service";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export const useRefreshMutation = () => {
    const { user, setUser, logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (!user?.refresh_token) {
                throw new Error("Missing session information");
            }

            const { data: refreshResult } = await refreshService(
                user.refresh_token
            );
            return refreshResult;
        },
        onSuccess: (authData) => {
            if (user) {
                setUser({
                    ...user,
                    access_token: authData.accessToken,
                    refresh_token: authData.refreshToken,
                    expires_in: authData.expiresIn,
                    refresh_expires_in: authData.refreshExpiresIn || 0,
                });
                toast.success("Sesión renovada con éxito.");
            }
        },
        onError: (error: any) => {
            console.error("Refresh Error:", error);
            toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            logout();
        }
    });
};
