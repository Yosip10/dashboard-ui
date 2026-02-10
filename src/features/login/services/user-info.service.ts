import apiClient from "../../../shared/api/api-client";
import type { UserInfo } from "../types/user-info";

const apiUrlInfo = import.meta.env.VITE_HOST_API_INFO;

export const getUserInformation = async (tenant: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return apiClient.get<UserInfo>(
        `${apiUrlInfo}/${tenant}/v1/getDetailUser`,
        config
    );
};
