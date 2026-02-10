import type { UserModule } from "./user-module";

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
