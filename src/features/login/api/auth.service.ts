import apiClient from "../../../shared/api/api-client";
import type { LoginResponse } from "../types/auth";

const apiUrl = import.meta.env.VITE_HOST_API_AUTH;

export const signinService = (data: any, accountId: string) => {
    const headers = { "x-accountId": accountId, 'content-type': 'application/x-www-form-urlencoded' };
    return apiClient.post<LoginResponse>(`${apiUrl}/auth/token/${accountId}`, { ...data, grant_type: 'password', client_id: "sign-in-scope" }, {
        headers,
    });
};

export const logoutService = (accountId: string, refresh_token: string) => {
    const headers = { "x-accountId": accountId };
    return apiClient.post(`${apiUrl}/auth/logout`, {
        refresh_token,

    }, {
        headers,
    });
};

/* export const getUserAllInfoService = (data: any, accountId: string) => {
    const headers = { "x-accountId": accountId };
    return apiClient.post<UserInfoResponse>(
        `${apiUrl}/auth/get-user-all-info?notToken`,
        data,
        { headers }
    );
}; */

export const refreshService = async (refreshToken: string) => {
    const url = "https://apigw-v2-dev.ado-tech.com/auth/realms/TuyaQA/protocol/openid-connect/token";
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", "sign-in-scope");
    params.append("refresh_token", refreshToken);

    const { data } = await apiClient.post(url, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    // Map snake_case to camelCase for the application LoginResponse
    return {
        data: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            scope: data.scope,
            issuedAt: String(Date.now()), // Or some other representation if not in response
            expiresAt: String(Date.now() + (data.expires_in * 1000)),
            refreshExpiresIn: data.refresh_expires_in,
        } as LoginResponse
    };
};
/**
 * Simula el servicio getUserAllInfoService
 * @param data - Datos del cuerpo de la petición (username, etc.)
 * @param accountId - ID de cuenta para los headers
 */
export const getUserAllInfoService = async (data: any, accountId: string) => {
    console.log(`Simulando petición a /auth/get-user-all-info con accountId: ${accountId}`);

    // Simulamos el retraso de la red
    await new Promise(resolve => setTimeout(resolve, 600));

    // Retornamos el objeto tal como lo haría apiClient (envuelto en .data)
    return {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
            "success": true,
            "message": "User obtained successfully",
            "StatusCode": 200,
            "code": "User obtained successfully",
            "data": {
                "id": "a3c3fb62-9305-46fe-9c4c-1c788848d37e",
                "createdTimestamp": 1718761273848,
                "username": data?.username || "1048272996", // Dinámico según lo que envíes
                "enabled": true,
                "totp": false,
                "emailVerified": true,
                "firstName": "carlos",
                "lastName": "vergel",
                "email": "carlosvergel01@gmail.com",
                "attributes": {
                    "birthdate": ["02-03-2002"],
                    "gender": ["male"],
                    "addres": ["calle"],
                    "adviser_id": ["https://digital-services-qa.turespaldo.co/api/HolaWeb/S3Manage/profileImg/share/photo2.svg"],
                    "phone_number": ["+573045715763"],
                    "advise_document": ["1052957192"],
                    "picture": ["https://i.ibb.co/QPmmrWw/thumbnail.webp"]
                },
                "disableableCredentialTypes": [],
                "requiredActions": [],
                "notBefore": 0,
                "access": {
                    "manageGroupMembership": true,
                    "view": true,
                    "mapRoles": true,
                    "impersonate": true,
                    "manage": true
                },
                "groups": [
                    {
                        "id": "872cb104-796a-4ffa-8913-36afcd3ae100",
                        "name": "ROLE-admin",
                        "path": "/ROLE-admin",
                        "attributes": {
                            "modulesLinked": [
                                "{\"name\":\"MODULE-operaciones\",\"id\":\"8eafcb02-d77f-433f-805d-fa20447be6bb\"}",
                                "{\"name\":\"MODULE-Administracion\",\"id\":\"153bd6aa-c8d7-4052-8312-f10755cf7cfd\"}"
                            ],
                            "description": ["description"]
                        },
                        "realmRoles": [
                            "PERMISE-Administracion-CREATE-SUBMODULE-Administracion-Solicitudes",
                            "PERMISE-Administracion-VIEW-SUBMODULE-Administracion-Solicitudes",
                            "PERMISE-operaciones-VIEW-SUBMODULE-operaciones-solicitudFlujo",
                            "PERMISE-Administracion-UPDATE-SUBMODULE-Administracion-Usuarios",
                            "PERMISE-operaciones-CREATE-SUBMODULE-operaciones-solicitudFlujo",
                            "PERMISE-Administracion-DELETE-SUBMODULE-Administracion-Roles",
                            "PERMISE-Administracion-DELETE-SUBMODULE-Administracion-Usuarios",
                            "PERMISE-operaciones-DELETE-SUBMODULE-operaciones-solicitudFlujo",
                            "PERMISE-Administracion-VIEW-SUBMODULE-Administracion-Usuarios",
                            "PERMISE-Administracion-DELETE-SUBMODULE-Administracion-Solicitudes",
                            "PERMISE-Administracion-UPDATE-SUBMODULE-Administracion-Roles",
                            "PERMISE-Administracion-CREATE-SUBMODULE-Administracion-Roles",
                            "PERMISE-operaciones-UPDATE-SUBMODULE-operaciones-solicitudFlujo",
                            "PERMISE-Administracion-VIEW-SUBMODULE-Administracion-Roles",
                            "PERMISE-Administracion-UPDATE-SUBMODULE-Administracion-Solicitudes",
                            "PERMISE-Administracion-CREATE-SUBMODULE-Administracion-Usuarios"
                        ],
                        "clientRoles": {
                            "realm-management": [
                                "view-events", "manage-authorization", "realm-admin", "manage-identity-providers",
                                "view-clients", "manage-clients", "view-identity-providers", "view-authorization",
                                "manage-events", "view-realm", "view-users", "impersonation", "manage-realm",
                                "query-users", "query-clients", "query-groups", "query-realms", "create-client", "manage-users"
                            ],
                            "broker": ["read-token"],
                            "account": [
                                "manage-account-links", "view-applications", "delete-account", "manage-account",
                                "view-consent", "view-profile", "view-groups", "manage-consent"
                            ]
                        }
                    }
                ]
            }
        }
    };
};

