import apiClient from "../../../shared/api/api-client";
import type { LoginResponse } from "../types/auth";
import type { UserInfo } from "../types/user-info";
import type { ApiResponse } from "../../../shared/api/types";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;
const apiUrlInfo = import.meta.env.VITE_HOST_API_INFO;

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

export const refreshService = async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    try {
        const url = `${apiUrlInfo}/auth/realms/TuyaQA/protocol/openid-connect/token`;
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("client_id", "sign-in-scope");
        params.append("refresh_token", refreshToken);

        const { data } = await apiClient.post(url, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return {
            data: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                tokenType: data.token_type,
                expiresIn: data.expires_in,
                scope: data.scope,
                issuedAt: String(Date.now()),
                expiresAt: String(Date.now() + (data.expires_in * 1000)),
                refreshExpiresIn: data.refresh_expires_in,
            } as LoginResponse,
            error: null
        };
    } catch (error: any) {
        return { data: null, error };
    }
};


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

