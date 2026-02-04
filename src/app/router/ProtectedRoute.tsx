import { useAuthStore } from "@/features/login/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        const tenant = location.pathname.split('/')[1];
        return <Navigate to={`/login/${tenant || ''}`} state={{ from: location }} replace />;
    }

    return <Outlet />;
};
