import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";
import type { ListRolesPayload } from "../types/roles";
import { getRolesService } from "../services/get-roles.service";

export const useRoles = (params: ListRolesPayload, useMock = false) => {
    const { user } = useAuthStore();
    const token = user?.access_token;
    const accountId = user?.["x-accountId"];

    return useQuery({
        queryKey: ["roles", token, accountId, params, useMock],
        queryFn: async () => {
            const { data, error } = await getRolesService();
            console.log("data", data)
            if (error) {
                toast.error(error.message);
                throw error;
            }

            return data;
        },
        enabled: !!token && !!accountId,
    });
};
