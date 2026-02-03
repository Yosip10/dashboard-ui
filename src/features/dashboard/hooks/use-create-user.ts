import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserService } from "../api/users.service";
import { toast } from "sonner";
import type { CreateUserRequest } from "../types/users";
import { useAuthStore } from "@/features/login/store/auth.store";

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const accountId = user?.["x-accountId"] || "";

    return useMutation({
        mutationFn: (data: CreateUserRequest) => createUserService(data, accountId),
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Usuario creado exitosamente.");
                queryClient.invalidateQueries({ queryKey: ["users"] });
            } else {
                toast.error(typeof data.message === 'string' ? data.message : "Error al crear usuario");
            }
        },
        onError: (error: any) => {
            console.error("Create User Error:", error);
            const errorMessage = error.response?.data?.message || "Error al conectar con el servidor";
            toast.error(errorMessage);
        }
    });
};
