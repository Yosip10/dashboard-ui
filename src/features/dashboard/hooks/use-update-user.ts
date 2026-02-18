import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserRequest } from "../types/users";
import { useAuthStore } from "@/features/login/store/auth.store";
import { updateUserService } from "../services/update-user.service";
import { toast } from "sonner";

export const useUpdateUserMutation = (onOpenChange: (open: boolean) => void, reset: () => void) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: async (data: UpdateUserRequest) => {
            const response = await updateUserService(data, accountId);
            if (response.error) throw response.error;
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Usuario actualizado exitosamente.");
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            if (data && !data.success) {
                console.warn("Update success but backend reported issues:", data.message);
            }
            onOpenChange(false);
            reset();
        },
        onError: (error: any) => {
            console.error("Update User Error:", error);
            toast.error(error.message || "Error al actualizar usuario");
        }
    });
};

