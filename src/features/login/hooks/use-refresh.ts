import { useMutation } from "@tanstack/react-query";
import { refreshService } from "../services/refresh-token.service";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export const useRefreshMutation = () => {
    const { user, setUser, logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (!user?.refresh_token) {
                throw new Error("Missing session information");
            }

            const response = await refreshService(user.refresh_token);
            if (response.error) throw response.error;
            if (!response.data) throw new Error("Error al renovar la sesión");

            return response.data;
        },
        onSuccess: (authData) => {
            if (user && authData) {
                setUser({
                    ...user,
                    access_token: authData.accessToken,
                    refresh_token: authData.refreshToken,
                    expires_in: authData.expiresIn,
                    refresh_expires_in: authData.refreshExpiresIn || 0,
                });

            }
        },
        onError: (error: any) => {
            console.error("Refresh Error:", error);
            toast.error(error.message || "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            logout();
        }
    });
};

