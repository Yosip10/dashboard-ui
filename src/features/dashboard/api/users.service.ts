import apiClient from "../../../shared/api/api-client";
import type { ListUsersResponse, ListUsersPayload, CreateUserRequest, CreateUserResponse } from "../types/users";

// Base URL provided by the user
const API_URL = "https://api-fintecheart-qa.ado-tech.com/api/v1/auth/list-users";
const CREATE_USER_URL = "https://api-fintecheart.ado-tech.com/api/v1/Request/createRequestMongo";

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
    const response = await apiClient.post<CreateUserResponse>(CREATE_USER_URL, data, {
        headers: {
            "x-accountId": accountId
        }
    });
    return response.data;
};


