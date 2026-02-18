import type { ApiResponse } from "@/shared/api/types";
import type { ListUsersPayload, ListUsersResponse } from "../types/users";
import apiClient from "@/shared/api/api-client";

export const getUsersService = async (accountId: string, payload: ListUsersPayload, _useMock = false): Promise<ApiResponse<ListUsersResponse>> => {
    try {
        const REAL_API_URL = "https://apigw-v2-dev.ado-tech.com/TuyaQA/v1/getAllUsers";

        const params = {
            search: payload.search || payload.filter || "",
            first: payload.skip || 0,
            max: payload.limit || 10
        };

        const response = await apiClient.get<any>(REAL_API_URL, {
            headers: {
                "x-accountId": accountId
            },
            params
        });

        // The backend returns an array of users directly: ListUser[]
        const usersArray = Array.isArray(response.data) ? response.data : [];

        // Try to get total from headers (standard name is x-total-count)
        // Fallback: if we got exactly 'max' items, assume there's at least one more page
        const totalFromHeader = parseInt(response.headers?.['x-total-count'] || response.headers?.['total-count'] || "0");
        const total = totalFromHeader > 0 ? totalFromHeader : (usersArray.length === params.max ? (params.first + params.max + 1) : (params.first + usersArray.length));

        // Transform to match ListUsersResponse interface
        const transformedResponse: ListUsersResponse = {
            success: true,
            message: "Usuarios cargados exitosamente",
            StatusCode: "200",
            data: {
                users: usersArray,
                total: total
            }
        };

        return { data: transformedResponse, error: null };
    } catch (error: any) {
        console.error("Error in getUsersService:", error);
        return { data: null, error };
    }
};