export interface RoleUser {
    initials: string;
    color: string;
}

export interface Role {
    id: string,
    name: string,
    path: string,
    attributes: {
        modulesLinked: string[],
        description: string[]
    },
    realmRoles: string[],
    clientRoles: {
        "realm-management": string[],
        broker: string[],
        account: string[]
    },
    subGroups: string[]
}

export interface ListRolesPayload {
    attributesToGet?: string;
    search?: string;
    column?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}



export type RoleColumn = "id" | "name";
