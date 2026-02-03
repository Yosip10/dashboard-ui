
import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { UsersPage } from "./UsersPage";
import { RolesPage } from "./RolesPage";
import { FlowRequestsPage } from "./FlowRequestsPage";

export type ViewType = "usuarios" | "roles" | "solicitudes";

const DashboardPage = () => {
    const [activeView, setActiveView] = useState<ViewType>("usuarios");

    return (
        <div className="flex min-h-screen bg-muted/30">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            <div className="flex-1 flex flex-col">
                <Header />
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