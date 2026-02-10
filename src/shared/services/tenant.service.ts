import { MOCK_TENANTS, type TenantConfig } from "../lib/mock-tenants";


export const fetchTenantConfig = async (
    tenantId: string
): Promise<TenantConfig> => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            const config = MOCK_TENANTS[tenantId];
            if (config) {
                resolve(config);
            } else {
                console.error(`[TenantService] Config NOT found for: ${tenantId}`);
                reject(new Error("Tenant not found"));
            }
        }, 1500); // 1.5s delay
    });
};
