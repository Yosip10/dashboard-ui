import type { ApiResponse } from "@/shared/api/types";
import type { CreateUserRequest, CreateUserResponse } from "../types/users";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO;

export const createUserService = async (data: CreateUserRequest, accountId: string): Promise<ApiResponse<CreateUserResponse>> => {
    try {
        const response = await apiClient.post<CreateUserResponse>(`${API_URL}/TuyaQA/v1/createUser`, data, {
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