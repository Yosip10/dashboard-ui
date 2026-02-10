

export interface UserModule {
    name: string;
    id: string;
    permits: string[];
}

export interface User {
    id?: string;
    name: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    username: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    "x-accountId": string;
    realm: string;
    groups: UserModule[];
    role: string[];
    [key: string]: any;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    issuedAt: string;
    expiresAt: string;
    refreshExpiresIn?: number;
    [key: string]: any;
}



export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
