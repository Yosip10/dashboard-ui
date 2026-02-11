import apiClient from "../../../shared/api/api-client";
import type { ApiResponse } from "../../../shared/api/types";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const logoutService = async (accountId: string, refresh_token: string): Promise<ApiResponse<any>> => {
    try {
        const headers = { "x-accountId": accountId };
        const response = await apiClient.post(`${apiUrl}/auth/logout`, {
            refresh_token,

        }, {
            headers,
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

