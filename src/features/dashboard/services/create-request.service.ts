import type { ApiResponse } from "@/shared/api/types";
import type { CreateUserRequest, CreateUserResponse } from "../types/users";
import apiClient from "@/shared/api/api-client";

const API_URL = import.meta.env.VITE_HOST_API_AUTH;

export const createRequestService = async (
  data: CreateUserRequest,
  accountId: string,
): Promise<ApiResponse<CreateUserResponse>> => {
  try {
    const response = await apiClient.post<CreateUserResponse>(
      `${API_URL}/flowManager/createFlowGeneric`,
      data,
      {
        headers: {
          "x-accountId": accountId,
          "Content-Type": "application/json",
        },
      },
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};
