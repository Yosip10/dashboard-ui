import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/login/store/auth.store";
import { Navigate, Outlet, useParams } from "react-router";
import { fetchTenantConfig, type TenantConfig } from "@/shared/services/tenant.service";
import { TenantContext } from "@/shared/context/TenantContext";
import { Loader, SessionMonitor } from "@/shared/components";

export const TenantGuard = () => {
    const { tenant } = useParams();
    const tenantId = tenant;
    const [currentTenant, setCurrentTenant] = useState<TenantConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<"not_found" | "failed" | null>(null);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const loadTenant = async () => {
            // 1. Validar parámetro de inquilino
            if (!tenantId) {
                setLoading(false);
                return; // Redirigir en render
            } else {
                setLoading(true);
                setError(null);

                try {
                    // 2. Verificar LocalStorage (Single Config Strategy)
                    const storageKey = "current_tenant_config";
                    const cachedConfigStr = localStorage.getItem(storageKey);

                    if (cachedConfigStr) {
                        const cachedConfig = JSON.parse(cachedConfigStr) as TenantConfig;
                        // Si la configuración en caché coincide con el inquilino solicitado -> Usarla
                        if (cachedConfig.id.toLowerCase() === tenantId.toLowerCase()) {
                            setCurrentTenant(cachedConfig);
                            setLoading(false);
                            return;
                        }

                        logout();
                    }

                    // 3. Obtener de API (Mock)
                    const config = await fetchTenantConfig(tenantId.toLocaleLowerCase());
                    // 4. Guardar en LocalStorage (Sobrescribir existente)
                    localStorage.setItem(storageKey, JSON.stringify(config));
                    setCurrentTenant(config);

                } catch (err) {
                    console.error("[TenantGuard] Error loading tenant:", err);
                    setError("not_found");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadTenant();
    }, [tenantId, logout]);

    useEffect(() => {
        if (!currentTenant) return;

        const root = document.documentElement;
        const theme = currentTenant.theme;

        root.style.setProperty('--ring', theme.primary);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--foreground', theme.foreground);
        root.style.setProperty('--card-bg', theme.cardBackground);
        root.style.setProperty('--border', theme.border);
    }, [currentTenant]);

    // Caso 1: No parámetro de inquilino -> Redirigir a 404
    if (!tenantId) {
        return <Navigate to="/404" replace />;
    }

    // Caso 2: Estado de Carga
    if (loading) {
        return <Loader />;
    }

    // Caso 3: Error Handling
    if (error === "not_found") {
        return <Navigate to="/company-no-found" replace />;
    }

    // Caso 4: Éxito -> Proporcionar Contexto y Renderizar Outlet
    return (
        <TenantContext.Provider value={{ tenantConfig: currentTenant }}>
            <SessionMonitor />
            <Outlet />
        </TenantContext.Provider>
    );
};
