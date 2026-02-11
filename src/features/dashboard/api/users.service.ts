import apiClient from "../../../shared/api/api-client";
import type { ListUsersResponse, ListUsersPayload, CreateUserRequest, CreateUserResponse, UpdateUserRequest, GenericResponse } from "../types/users";
import type { ApiResponse } from "../../../shared/api/types";
import { MOCK_USERS } from "../data/mock-users";


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


export const createUserService = async (data: CreateUserRequest, accountId: string): Promise<ApiResponse<CreateUserResponse>> => {
    try {
        const response = await apiClient.post<CreateUserResponse>(API_URL, data, {
            headers: {
                "x-accountId": accountId,
                "Content-Type": "application/json"
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

export const updateUserService = async (data: UpdateUserRequest, accountId: string): Promise<ApiResponse<GenericResponse>> => {
    try {
        const updatePayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            enabled: data.enabled
        };

        const response = await apiClient.put<GenericResponse>(`${API_URL}/${data.id}`, updatePayload, {
            headers: {
                "x-accountId": accountId,
                "Content-Type": "application/json"
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

export const deleteUserService = async (userId: string, accountId: string): Promise<ApiResponse<GenericResponse>> => {
    try {
        const response = await apiClient.delete<GenericResponse>(`${API_URL}/${userId}`, {
            headers: {
                "x-accountId": accountId
            }
        });
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
};

