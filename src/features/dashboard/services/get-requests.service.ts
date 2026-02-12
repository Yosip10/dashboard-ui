import type { ApiResponse } from "@/shared/api/types";
import { MOCK_REQUESTS } from "../data/mock-request";
import type { ListRequestsPayload, ListRequestsResponse, RequestColumn } from "../types/requests";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_INFO + "/requests"; // Assuming this is the endpoint
const DEFAULT_PAYLOAD: ListRequestsPayload = {
    attributesToGet: "",
    filter: "",
    limit: 10,
    skip: 0
};

export const getRequestsService = async (accountId: string, payload: ListRequestsPayload, useMock = false): Promise<ApiResponse<ListRequestsResponse>> => {
    if (useMock) {
        // Simulate pagination for mock data
        const limit = payload.limit || 10;
        const skip = payload.skip || 0;
        const filteredRequests = payload.search
            ? MOCK_REQUESTS.filter((req) =>
                req[payload?.column as RequestColumn || "id"]
                    .toString()
                    .toLowerCase()
                    .includes(payload.search?.toLowerCase() || "")
            )
            : MOCK_REQUESTS;

        const paginatedRequests = filteredRequests.slice(skip, skip + limit);

        return {
            data: {
                success: true,
                message: "Mock requests loaded successfully",
                StatusCode: "200",
                data: {
                    requests: paginatedRequests
                }
            },
            error: null
        };
    }

    try {
        const finalPayload = { ...DEFAULT_PAYLOAD, ...payload };
        const response = await apiClient.post<ListRequestsResponse>(API_URL, finalPayload, {
            headers: {
                "x-accountId": accountId
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};
