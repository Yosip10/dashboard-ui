import type { ApiResponse } from "@/shared/api/types";
import type { GenericResponse } from "../types/users";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO;

export const deleteUserService = async (userId: string, accountId: string): Promise<ApiResponse<GenericResponse>> => {
    try {
        const response = await apiClient.delete<GenericResponse>(`${API_URL}/TuyaQA/v1/users/${userId}`, {
            headers: {
                "x-accountId": accountId
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};