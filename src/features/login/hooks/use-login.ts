import { useMutation } from "@tanstack/react-query";
import { signinService, getUserAllInfoService } from "../api/auth.service";
import { useAuthStore } from "../store/auth.store";
import { handleRoleModule, handleRoleName, parseUserAttributes } from "../utils/auth.helpers";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

interface LoginParams {
    username: string;
    password: string;
    accountId: string;
    rememberMe: boolean;
}

export const useLoginMutation = () => {
    const { setUser } = useAuthStore();
    let navigate = useNavigate();
    const { tenant } = useParams();

    return useMutation({
        mutationFn: async ({ username, password, accountId, rememberMe }: LoginParams) => {
            const bodyLogin = { username, password };

            // 1. Sign in
            const { data: authResult } = await signinService(bodyLogin, accountId);
            const authData = authResult;
            // 2. Get user info
            const { data: userInfoResult } = await getUserAllInfoService(
                { accessToken: authData.accessToken },
                accountId
            );
            const { data: userData } = userInfoResult;
            return { authData, userData, accountId, username, rememberMe };
        },
        onSuccess: ({ authData, userData, accountId, username, rememberMe }) => {
            const userObject = parseUserAttributes(userData?.attributes);
            const groups = handleRoleModule(userData?.groups);
            const role = handleRoleName(userData?.groups);

            if (rememberMe) {
                localStorage.setItem('remember', JSON.stringify({ username, accountId }));
            } else {
                localStorage.removeItem('remember');
            }

            setUser({
                ...userObject,
                name: `${userData?.firstName} ${userData?.lastName}`,
                given_name: userData?.firstName,
                family_name: userData?.lastName,
                email: userData?.email,
                access_token: authData.accessToken,
                refresh_token: authData.refreshToken,
                expires_in: authData.expiresIn,
                refresh_expires_in: authData.refreshExpiresIn || 0,
                username: username,
                'x-accountId': accountId,
                realm: accountId,
                groups,
                role
            });

            toast.success("Login exitoso.");
            navigate(`/${tenant}`);
        },
        onError: (error: any) => {
            console.error("Login Error:", error);
            toast.error("Credenciales invalidas.");
        }
    });
};
