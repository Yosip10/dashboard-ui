import apiClient from "../../../shared/api/api-client";
import type { LoginResponse } from "../types/login-response";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const signinService = (data: any, accountId: string) => {
    const headers = { "x-accountId": accountId, 'content-type': 'application/x-www-form-urlencoded' };
    return apiClient.post<LoginResponse>(`${apiUrl}/auth/token/${accountId}`, { ...data, grant_type: 'password', client_id: "sign-in-scope" }, {
        headers,
    });
};
