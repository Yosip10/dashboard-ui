import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";
import type { ListUsersPayload } from "../types/users";
import { getUsersService } from "../services/get-users.service";

export const useUsers = (params: ListUsersPayload) => {
    const { user } = useAuthStore();
    const token = user?.access_token;
    const accountId = user?.["x-accountId"];
    return useQuery({
        queryKey: ["users", params.skip],
        queryFn: async () => {
            const { data, error } = await getUsersService(accountId || "", params);

            if (error) {
                toast.error(error.message);
                throw error;
            }

            return data;
        },
        enabled: !!token && !!accountId,
        placeholderData: keepPreviousData,
    });
};


