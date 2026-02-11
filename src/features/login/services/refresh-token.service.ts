import apiClient from "../../../shared/api/api-client";
import type { LoginResponse } from "../types/login-response";
import type { ApiResponse } from "../../../shared/api/types";

const apiUrlInfo = import.meta.env.VITE_HOST_API_INFO;

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

