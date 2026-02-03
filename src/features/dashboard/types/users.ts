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
    };
}

export interface ListUsersPayload {
    attributesToGet?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export interface CreateUserRequest {
    typeRequest: number;
    observation: string;
    asing_to: string;
    dataUserModel: {
        reference: number;
        email: string;
        cc: string;
        enable: boolean;
        name: string;
        lastname: string;
        adviserCode: string;
        adviseDocument: string;
        gener: string;
        celphone: string;
        birthDate: string;
        picture: {
            src: string;
            name: string;
        };
        idBranch: string;
        typeDocuemnt: string;
        role: string;
        idDepartment: string;
        addres: string;
        parentCoordinator: string;
        parentCoordinatorName: string;
    };
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    StatusCode: string;
    data?: any;
}

