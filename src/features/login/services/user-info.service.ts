import apiClient from "../../../shared/api/api-client";
import type { UserInfo } from "../types/user-info";
import type { ApiResponse } from "../../../shared/api/types";

const apiUrlInfo = import.meta.env.VITE_HOST_API_INFO;

export const getUserInformation = async (tenant: string, token?: string): Promise<ApiResponse<UserInfo>> => {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await apiClient.get<UserInfo>(
            `${apiUrlInfo}/${tenant}/v1/getDetailUser`,
            config
        );
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

