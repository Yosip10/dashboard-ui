import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/login/store/auth.store";
import { getRoleMembersService, type RoleMember } from "../services/get-role-members.service";

export const useRoleMembers = (roleId: string | null) => {
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] ?? "";

    return useQuery<RoleMember[]>({
        queryKey: ["role-members", roleId, accountId],
        queryFn: async () => {
            if (!roleId) return [];
            const { data, error } = await getRoleMembersService(roleId, accountId);
            if (error) throw error;
            return data ?? [];
        },
        enabled: !!roleId && !!accountId,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
