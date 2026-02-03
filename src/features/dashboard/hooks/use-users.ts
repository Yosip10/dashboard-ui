import { useQuery } from "@tanstack/react-query";
import { getUsersService } from "../api/users.service";
import type { ListUsersPayload } from "../types/users";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";

export const useUsers = (params: ListUsersPayload = {}) => {
    const { user, logout } = useAuthStore();
    const token = user?.access_token;
    const accountId = user?.["x-accountId"];

    return useQuery({
        queryKey: ["users", token, accountId, params],
        queryFn: async () => {
            try {
                const data = await getUsersService(accountId || "", params);

                // Handle token expired in successful response body
                if (data.code === "TOKEN_EXPIRED" || data.statusCode === "40001") {
                    logout();
                    throw new Error("TOKEN_EXPIRED");
                }

                return data;
            } catch (error: any) {
                // Handle token expired in axios error response
                const errorData = error.response?.data;
                if (errorData?.code === "TOKEN_EXPIRED" || errorData?.statusCode === "40001") {
                    logout();
                    toast.error("Sesión expirada");
                }
                throw error;
            }
        },
        enabled: !!token && !!accountId,
    });
};
