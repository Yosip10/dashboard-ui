import { useAuthStore } from "@/features/login/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router";

export const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (isAuthenticated) {
        const tenant = location.pathname.split('/')[2]; // /login/tenant -> tenant
        return <Navigate to={`/${tenant || ''}`} replace />;
    }

    return <Outlet />;
};
