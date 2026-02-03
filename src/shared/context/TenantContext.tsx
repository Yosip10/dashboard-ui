import { createContext, useContext } from "react";
import type { TenantConfig } from "../services/tenant.service";

interface TenantContextType {
    tenantConfig: TenantConfig | null;
}

export const TenantContext = createContext<TenantContextType | undefined>(
    undefined
);

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error("useTenant debe usarse dentro de un TenantProvider");
    }
    return context;
};
