import { useAuthStore } from "@/features/login/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={`/login${location.search}`} state={{ from: location }} replace />;
    }

    return <Outlet />;
};
