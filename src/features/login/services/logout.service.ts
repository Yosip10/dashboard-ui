import apiClient from "../../../shared/api/api-client";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const logoutService = (accountId: string, refresh_token: string) => {
    const headers = { "x-accountId": accountId };
    return apiClient.post(`${apiUrl}/auth/logout`, {
        refresh_token,

    }, {
        headers,
    });
};
