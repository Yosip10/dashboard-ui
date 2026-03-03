import type { ApiResponse } from "@/shared/api/types";
import type { ListRequestsResponse, RequestPayload } from "../types/requests";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_LINK;

export const getRequestsService = async (
  params: RequestPayload,
): Promise<ApiResponse<ListRequestsResponse>> => {
  try {
    const response = await apiClient.get<ListRequestsResponse>(
      `${API_URL}/flowmanager/flowrequest/pagination?limit=${params.limit}&skip=${params.skip}&search=${params.search}`,
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};
