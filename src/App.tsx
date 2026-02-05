import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { LoginView } from "@/features/login";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { PublicRoute } from "./app/router/PublicRoute";
import ErrorPage from "./shared/components/errorPage";
import CompanyNoFound from "./shared/components/companyNoFound";
import { TenantGuard } from "./app/router/TenantGuard";
import { useTokenRefresh } from "./features/login/hooks/use-token-refresh";

const router = createBrowserRouter([
    {
        element: <TenantGuard />,
        errorElement: <ErrorPage />,
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
        element: <CompanyNoFound />,
    },
    {
        path: "/404",
        element: <ErrorPage />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    }
]);


function App() {
    useTokenRefresh();

    return <RouterProvider router={router} />;
}

export default App;