import { useAuthStore } from "@/features/login/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router";

export const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to={`/${location.search}`} replace />;
    }

    return <Outlet />;
};
