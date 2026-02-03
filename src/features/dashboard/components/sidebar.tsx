import { Users, Shield, FileText, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import type { ViewType } from "../pages/DashboardPage";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/login/store/auth.store";
import { useContext } from "react";
import { TenantContext } from "@/shared/context/TenantContext";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const menuItems = [
    { id: "usuarios" as ViewType, label: "Usuarios", icon: Users },
    { id: "roles" as ViewType, label: "Roles", icon: Shield },
    {
        id: "solicitudes" as ViewType,
        label: "Solicitudes",
        icon: FileText,
    },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const context = useContext(TenantContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <aside className="w-72 bg-background border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-[17.5px] border-b border-gray-200 h-16">
                <div className="flex items-center gap-3">
                    <img src={context?.tenantConfig?.logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="font-semibold text-xl text-foreground">
                        {context?.tenantConfig?.name}
                    </span>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3">
                    Menu
                </p>
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = activeView === item.id;
                        const Icon = item.icon;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onViewChange(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group cursor-pointer",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-gray-200 hover:text-foreground",
                                    )}
                                >
                                    {/* Glassmorphism icon container */}
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                                            "backdrop-blur-sm border",
                                            isActive
                                                ? "bg-primary/20 border-primary/30 shadow-lg shadow-primary/20"
                                                : "bg-background/50 border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-105",
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-4 h-4 transition-colors duration-200",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground group-hover:text-primary",
                                            )}
                                        />
                                    </div>
                                    <span className="font-medium text-md">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer with Logout */}
            <div className="p-4 border-t border-gray-200 space-y-3">

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 px-3 py-2 h-auto text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-all duration-200"
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background/50 border border-border/50 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all duration-200">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                </Button>
            </div>
        </aside>
    );
}
