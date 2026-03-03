import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/login/store/auth.store";
import { createRequestService } from "../services/create-request.service";

export const useCreateRequestMutation = (
  onClose: (open: boolean) => void,
  reset: () => void,
) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const accountId = user?.["x-accountId"] || "";

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createRequestService(data, accountId);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitud creada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Create Request Error:", error);
      toast.error(error.message || "Error al crear solicitud");
    },
  });
};
