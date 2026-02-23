import type { ApiResponse } from "@/shared/api/types";
import apiClient from "@/shared/api/api-client";

export interface RoleMember {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    enabled?: boolean;
}

const BASE_URL = "https://apigw-v2-dev.ado-tech.com/tuyaQA/v1";

export const getRoleMembersService = async (
    roleId: string,
    accountId: string
): Promise<ApiResponse<RoleMember[]>> => {
    try {
        const response = await apiClient.get<RoleMember[]>(
            `${BASE_URL}/${roleId}/getAllMembers`,
            {
                headers: {
                    "x-accountId": accountId,
                },
            }
        );
        const members = Array.isArray(response.data) ? response.data : [];
        return { data: members, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};
