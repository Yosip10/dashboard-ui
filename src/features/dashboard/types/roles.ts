export interface RoleUser {
    initials: string;
    color: string;
}

export interface Role {
    id: string;
    name: string;
    users: RoleUser[];
    modules: string[];
    active: boolean;
}

export interface ListRolesPayload {
    attributesToGet?: string;
    search?: string;
    column?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export interface ListRolesResponse {
    success: boolean;
    message: string | { error: string };
    StatusCode: string;
    data: {
        roles: Role[];
    };
}

export type RoleColumn = "id" | "name";
