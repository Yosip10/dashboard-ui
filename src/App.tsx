import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { LoginView } from "@/features/login";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { PublicRoute } from "./app/router/PublicRoute";
import { TenantGuard } from "./app/router/TenantGuard";
import { useTokenRefresh } from "./features/login/hooks/use-token-refresh";
import { CompanyNotFound, NotFound } from "./shared/components";

const router = createBrowserRouter([
    {
        element: <TenantGuard />,
        errorElement: <NotFound />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/:tenant",
                        element: <DashboardPage />,
                    },
                ],
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "login/:tenant",
                        element: <LoginView />,
                    },
                ],
            },
        ],
    },
    {
        path: "/company-no-found",
        element: <CompanyNotFound />,
    },
    {
        path: "/404",
        element: <NotFound />,
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);


function App() {
    useTokenRefresh();

    return <RouterProvider router={router} />;
}

export default App;