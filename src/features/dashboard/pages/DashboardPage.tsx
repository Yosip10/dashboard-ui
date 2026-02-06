
import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { UsersPage } from "./UsersPage";
import { RolesPage } from "./RolesPage";
import { FlowRequestsPage } from "./FlowRequestsPage";

export type ViewType = "usuarios" | "roles" | "solicitudes";

const DashboardPage = () => {
    const [activeView, setActiveView] = useState<ViewType>("usuarios");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/30 relative">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                activeView={activeView}
                onViewChange={(view) => {
                    setActiveView(view);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeView === "usuarios" && <UsersPage />}
                        {activeView === "roles" && <RolesPage />}
                        {activeView === "solicitudes" && <FlowRequestsPage />}
                    </div>
                </main>
            </div>
        </div>
    );
}
export default DashboardPage;