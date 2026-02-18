import type { ApiResponse } from "@/shared/api/types";
import type { GenericResponse, UpdateUserRequest } from "../types/users";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO;

export const updateUserService = async (data: UpdateUserRequest, accountId: string): Promise<ApiResponse<GenericResponse>> => {
    try {
        const updatePayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            enabled: data.enabled
        };

        const response = await apiClient.put<GenericResponse>(`${API_URL}/TuyaQA/v1/users/${data.id}`, updatePayload, {
            headers: {
                "x-accountId": accountId,
                "Content-Type": "application/json"
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};