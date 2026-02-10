import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserService } from "../api/users.service";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: (userId: string) => deleteUserService(userId, accountId),
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Usuario eliminado exitosamente.");
                queryClient.invalidateQueries({ queryKey: ["users"] });
            } else {
                toast.error(typeof data.message === 'string' ? data.message : "Error al eliminar usuario");
            }
        },
        onError: (error: any) => {
            console.error("Delete User Error:", error);
            const errorMessage = error.response?.data?.message || "Error al conectar con el servidor";
            toast.error(errorMessage);
        }
    });
};
