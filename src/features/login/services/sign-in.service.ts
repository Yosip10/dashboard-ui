import apiClient from "../../../shared/api/api-client";
import type { LoginResponse } from "../types/login-response";
import type { ApiResponse } from "../../../shared/api/types";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const signinService = async (data: any, accountId: string): Promise<ApiResponse<LoginResponse>> => {
    try {
        const headers = { "x-accountId": accountId, 'content-type': 'application/x-www-form-urlencoded' };
        const response = await apiClient.post<LoginResponse>(`${apiUrl}/auth/token/${accountId}`, { ...data, grant_type: 'password', client_id: "sign-in-scope" }, {
            headers,
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

