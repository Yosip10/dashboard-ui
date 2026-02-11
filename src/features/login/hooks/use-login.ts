import { useMutation } from "@tanstack/react-query";
import { signinService } from "../services/sign-in.service";
import { getUserInformation } from "../services/user-info.service";
import { useAuthStore } from "../store/auth.store";

import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

interface LoginParams {
    username: string;
    password: string;
    accountId: string;
    rememberMe: boolean;
}

interface LoginOptions {
    redirect?: boolean;
}

export const useLoginMutation = (options: LoginOptions = { redirect: true }) => {
    const { setUser } = useAuthStore();
    let navigate = useNavigate();
    const { tenant } = useParams();

    return useMutation({
        mutationFn: async ({ username, password, accountId, rememberMe }: LoginParams) => {
            const bodyLogin = { username, password };

            // 1. Sign in
            const signinResponse = await signinService(bodyLogin, accountId);
            if (signinResponse.error) throw signinResponse.error;

            const authData = signinResponse.data;
            if (!authData) throw new Error("Error en la autenticación");

            // 2. Get user info
            const userResponse = await getUserInformation("tuyaQA", authData.accessToken);
            if (userResponse.error) throw userResponse.error;

            const userData = userResponse.data;
            if (!userData) throw new Error("Error al obtener información del usuario");

            return { authData, userData, accountId, username, rememberMe };
        },

        onSuccess: ({ authData, userData, accountId, username, rememberMe }) => {
            if (rememberMe) {
                localStorage.setItem('remember', JSON.stringify({ username, accountId }));
            } else {
                localStorage.removeItem('remember');
            }

            setUser({
                ...userData,
                id: userData.sub,
                name: userData.name,
                given_name: userData.given_name,
                family_name: userData.family_name,
                email: userData.email,
                username: userData.preferred_username,
                access_token: authData.accessToken,
                refresh_token: authData.refreshToken,
                expires_in: authData.expiresIn,
                refresh_expires_in: authData.refreshExpiresIn || 0,
                "x-accountId": accountId,
                realm: accountId,
                groups: [],
                role: []
            });

            toast.success("Login exitoso.");
            if (options.redirect) {
                navigate(`/${tenant}`);
            }
        },
        onError: (error: any) => {
            console.error("Login Error:", error);
            toast.error(error.message || "Credenciales invalidas.");
        }

    });
};
