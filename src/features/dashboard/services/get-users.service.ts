import type { ApiResponse } from "@/shared/api/types";
import { MOCK_USERS } from "../data/mock-users";
import type { ListUsersPayload, ListUsersResponse } from "../types/users";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO;
const DEFAULT_PAYLOAD: ListUsersPayload = {
    attributesToGet: "",
    filter: "",
    limit: 10,
    skip: 0
};


export const getUsersService = async (accountId: string, payload: ListUsersPayload = {}, useMock = false): Promise<ApiResponse<ListUsersResponse>> => {
    if (useMock) {
        // Simulate pagination for mock data
        const limit = payload.limit || 10;
        const skip = payload.skip || 0;
        const paginatedUsers = MOCK_USERS.slice(skip, skip + limit);

        return {
            data: {
                success: true,
                message: "Mock users loaded successfully",
                StatusCode: "200",
                data: {
                    users: paginatedUsers
                }
            },
            error: null
        };
    }

    try {
        const finalPayload = { ...DEFAULT_PAYLOAD, ...payload };
        const response = await apiClient.post<ListUsersResponse>(API_URL, finalPayload, {
            headers: {
                "x-accountId": accountId
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};