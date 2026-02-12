import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";
import { deleteUserService } from "../services/delete-user.service";

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await deleteUserService(userId, accountId);
            if (response.error) throw response.error;
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.success) {
                toast.success("Usuario eliminado exitosamente.");
                queryClient.invalidateQueries({ queryKey: ["users"] });
            } else {
                toast.error(typeof data?.message === 'string' ? data.message : "Error al eliminar usuario");
            }
        },
        onError: (error: any) => {
            console.error("Delete User Error:", error);
            toast.error(error.message || "Error al eliminar usuario");
        }
    });
};

