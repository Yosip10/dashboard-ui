import apiClient from "../../../shared/api/api-client";
import type { ListUsersResponse, ListUsersPayload, CreateUserRequest, CreateUserResponse, UpdateUserRequest, GenericResponse } from "../types/users";


const API_URL = import.meta.env.VITE_HOST_API_INFO;
const DEFAULT_PAYLOAD: ListUsersPayload = {
    attributesToGet: "",
    filter: "",
    limit: 10,
    skip: 0
};

export const getUsersService = async (accountId: string, payload: ListUsersPayload = {}) => {
    const finalPayload = { ...DEFAULT_PAYLOAD, ...payload };
    const response = await apiClient.post<ListUsersResponse>(API_URL, finalPayload, {
        headers: {
            "x-accountId": accountId
        }
    });
    return response.data;
};

export const createUserService = async (data: CreateUserRequest, accountId: string) => {
    const response = await apiClient.post<CreateUserResponse>(API_URL, data, {
        headers: {
            "x-accountId": accountId,
            "Content-Type": "application/json"
        }
    });
    return response.data;
};

export const updateUserService = async (data: UpdateUserRequest, accountId: string) => {
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
    return response.data;
};

export const deleteUserService = async (userId: string, accountId: string) => {
    const response = await apiClient.delete<GenericResponse>(`${API_URL}/${userId}`, {
        headers: {
            "x-accountId": accountId
        }
    });
    return response.data;
};
