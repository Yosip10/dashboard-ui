import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserService } from "../api/users.service";
import { toast } from "sonner";
import type { UpdateUserRequest } from "../types/users";
import { useAuthStore } from "@/features/login/store/auth.store";

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: (data: UpdateUserRequest) => updateUserService(data, accountId),
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Usuario actualizado exitosamente.");
                queryClient.invalidateQueries({ queryKey: ["users"] });
            } else {
                toast.error(typeof data.message === 'string' ? data.message : "Error al actualizar usuario");
            }
        },
        onError: (error: any) => {
            console.error("Update User Error:", error);
            const errorMessage = error.response?.data?.message || "Error al conectar con el servidor";
            toast.error(errorMessage);
        }
    });
};
