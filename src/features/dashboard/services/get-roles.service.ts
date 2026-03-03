import type { ApiResponse } from "@/shared/api/types";
import type { Role, ListRolesPayload } from "../types/roles";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO;

/**
 * Obtiene la lista de roles con soporte para paginación.
 * @param params Parámetros de paginación (limit, skip, etc.)
 */
export const getRolesService = async (
  params: ListRolesPayload,
): Promise<ApiResponse<Role[]>> => {
  try {
    const limit = params.limit || 10;
    const skip = params.skip || 0;

    // Ajustamos la URL para pasar skip y limit dinámicos
    // Asumimos que la estructura es /.../skip/.../limit/...
    const url = `${API_URL}/TuyaQA/v1/ROLE-ADMIN/${skip}/false/${limit}/false/searchGroup`;

    const response = await apiClient.get<Role[]>(url);
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};
