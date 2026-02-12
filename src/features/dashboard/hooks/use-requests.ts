import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";
import type { ListRequestsPayload } from "../types/requests";
import { getRequestsService } from "../services/get-requests.service";

export const useRequests = (params: ListRequestsPayload, useMock = false) => {
    const { user } = useAuthStore();
    const token = user?.access_token;
    const accountId = user?.["x-accountId"];

    return useQuery({
        queryKey: ["requests", token, accountId, params, useMock],
        queryFn: async () => {
            const { data, error } = await getRequestsService(accountId || "", params, useMock);

            if (error) {
                toast.error(error.message);
                throw error;
            }

            return data;
        },
        enabled: !!token && !!accountId,
    });
};
