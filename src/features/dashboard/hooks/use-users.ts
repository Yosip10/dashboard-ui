import { useQuery } from "@tanstack/react-query";
import { getUsersService } from "../api/users.service";
import type { ListUsersPayload } from "../types/users";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";

export const useUsers = (params: ListUsersPayload = {}, useMock = false) => {
    const { user } = useAuthStore();
    const token = user?.access_token;
    const accountId = user?.["x-accountId"];

    return useQuery({
        queryKey: ["users", token, accountId, params, useMock],
        queryFn: async () => {
            const { data, error } = await getUsersService(accountId || "", params, useMock);

            if (error) {
                toast.error(error.message);
                throw error;
            }

            return data;
        },
        enabled: !!token && !!accountId,
    });
};


