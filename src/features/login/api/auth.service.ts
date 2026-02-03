import apiClient from "../../../shared/api/api-client";
import type { LoginResponse, UserInfoResponse } from "../types/auth";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const signinService = (data: any, accountId: string) => {
    const headers = { "x-accountId": accountId, 'content-type': 'application/x-www-form-urlencoded' };
    return apiClient.post<LoginResponse>(`https://apigw-v2-dev.ado-tech.com/api/auth/token/${accountId}`, { ...data, grant_type: 'password', client_id: "sign-in-scope" }, {
        headers,
    });
};

export const getUserAllInfoService = (data: any, accountId: string) => {
    const headers = { "x-accountId": accountId };
    return apiClient.post<UserInfoResponse>(
        `${apiUrl}/auth/get-user-all-info?notToken`,
        data,
        { headers }
    );
};

export const refreshService = (refreshToken: string, accountId: string) => {
    const headers = { "x-accountId": accountId };
    return apiClient.post<LoginResponse>(`${apiUrl}/auth/refresh-token`, { refreshToken }, {
        headers,
    });
};

