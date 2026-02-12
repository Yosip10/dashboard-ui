import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateUserRequest } from "../types/users";
import { useAuthStore } from "@/features/login/store/auth.store";
import { createUserService } from "../services/create-user.service";

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: async (data: CreateUserRequest) => {
            const response = await createUserService(data, accountId);
            if (response.error) throw response.error;
            return response.data;
        },
        onSuccess: () => {
            toast.success("Usuario creado exitosamente.");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            console.error("Create User Error:", error);
            toast.error(error.message || "Error al crear usuario");
        }
    });
};

