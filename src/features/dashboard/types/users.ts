export interface UserAttribute {
    role?: string[];
    idBranch?: string[];
    birthdate?: string[];
    gender?: string[];
    typeDocuemnt?: string[];
    addres?: string[];
    parentCoordinatorName?: string[];
    picture?: string[];
    parentCoordinator?: string[];
    phone_number?: string[];
    adviser_code?: string[];
    adviseDocument?: string[];
    idDepartment?: string[];
    [key: string]: string[] | undefined;
}

export interface UserRole {
    id: string;
    name: string;
    path: string;
}

export interface UserAccess {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
}

export interface ListUser {
    id: string;
    createdTimestamp: number;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    attributes: UserAttribute;
    disableableCredentialTypes: string[];
    requiredActions: string[];
    notBefore: number;
    access: UserAccess;
    roles: UserRole[];
    lastSession: string | null;
}

export interface ListUsersResponse {
    success: boolean;
    message: string | { error: string };
    StatusCode: string;
    statusCode?: string;
    code?: string;
    data: {
        users: ListUser[];
        total?: number;
    };
}

export interface ListUsersPayload {
    attributesToGet?: string;
    search?: string;
    column?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export type UserColumn = "username" | "email" | "firstName" | "lastName";

export interface UserCredential {
    type: string;
    value: string;
    temporary: boolean;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    enabled: boolean;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    credentials: UserCredential[];
    attributes?: Record<string, any>; // Flexible for extra fields if needed
    groups?: string[];
}

export interface UpdateUserRequest {
    id: string;
    username?: string;
    email?: string;
    enabled?: boolean;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    credentials?: UserCredential[];
    attributes?: Record<string, any>;
    groups?: string[];
}

export interface DeleteUserRequest {
    id: string;
}


export interface CreateUserResponse {
    success: boolean;
    message: string;
    StatusCode: string;
    data?: any;
}

export interface GenericResponse {
    success: boolean;
    message: string;
    StatusCode: string;
    data?: any;
}
