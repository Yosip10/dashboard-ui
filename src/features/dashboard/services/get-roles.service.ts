import type { ApiResponse } from "@/shared/api/types";
import type { Role } from "../types/roles";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO

export const getRolesService = async (): Promise<ApiResponse<Role[]>> => {
    try {
        const response = await apiClient.get<Role[]>(`${API_URL}/TuyaQA/v1/ROLE-ADMIN/0/false/10/false/searchGroup`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};
