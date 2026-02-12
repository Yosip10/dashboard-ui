import type { ApiResponse } from "@/shared/api/types";
import { MOCK_ROLES } from "../data/mock-roles";
import type { ListRolesPayload, ListRolesResponse, RoleColumn } from "../types/roles";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO + "/roles"; // Assuming this is the endpoint
const DEFAULT_PAYLOAD: ListRolesPayload = {
    attributesToGet: "",
    filter: "",
    limit: 10,
    skip: 0
};

export const getRolesService = async (accountId: string, payload: ListRolesPayload, useMock = false): Promise<ApiResponse<ListRolesResponse>> => {
    if (useMock) {
        // Simulate pagination for mock data
        const limit = payload.limit || 10;
        const skip = payload.skip || 0;
        const filteredRoles = payload.search
            ? MOCK_ROLES.filter((role) =>
                role[payload?.column as RoleColumn || "name"]
                    .toString()
                    .toLowerCase()
                    .includes(payload.search?.toLowerCase() || "")
            )
            : MOCK_ROLES;

        const paginatedRoles = filteredRoles.slice(skip, skip + limit);

        return {
            data: {
                success: true,
                message: "Mock roles loaded successfully",
                StatusCode: "200",
                data: {
                    roles: paginatedRoles
                }
            },
            error: null
        };
    }

    try {
        const finalPayload = { ...DEFAULT_PAYLOAD, ...payload };
        const response = await apiClient.post<ListRolesResponse>(API_URL, finalPayload, {
            headers: {
                "x-accountId": accountId
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};
