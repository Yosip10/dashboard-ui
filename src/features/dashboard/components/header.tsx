import { useEffect } from "react";
import { useAuthStore } from "@/features/login/store/auth.store";
import { useSearch } from "@/shared/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Search, Menu, DatabaseIcon } from "lucide-react";
import type { ViewType } from "../pages/DashboardPage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface HeaderProps {
    onMenuClick: () => void;
    activeView: ViewType;
}

export function Header({ onMenuClick, activeView }: HeaderProps) {
    const { user } = useAuthStore();
    const { search, setSearch, column, setColumn } = useSearch();
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    useEffect(() => {
        setColumn("");
        setSearch("");
    }, [activeView]);

    const getColumnToSearch = () => {
        switch (activeView) {
            case "usuarios":
                return [
                    { value: "username", label: "Username" },
                    { value: "email", label: "Email" },
                    { value: "firstName", label: "Nombre" },
                    { value: "lastName", label: "Apellido" },
                ]
            case "roles":
                return [
                    { value: "id", label: "Código" },
                    { value: "name", label: "Nombre del Rol" },
                ]
            case "solicitudes":
                return [
                    { value: "id", label: "ID" },
                    { value: "document", label: "Documento" },
                    { value: "password", label: "Clave" },
                    { value: "status", label: "Estado" },
                ]
            default:
                return []
        }
    }
    return (
        <header className="h-16 border-b border-gray-200 overflow-x-auto bg-background px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>
            {/* Search */}
            <div className="flex items-center gap-5 w-full">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        disabled={!column}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar..."
                        className="pl-10 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all duration-200"
                    />
                </div>
                <div className="w-full">
                    <Select value={column} onValueChange={(value) => {
                        setColumn(value)
                        setSearch("")
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione la columna a buscar" />
                        </SelectTrigger>
                        <SelectContent>
                            {getColumnToSearch().map((column) => (
                                <SelectItem key={column.value} value={column.value}>
                                    {column.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                            <DatabaseIcon className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Busqueda avanzada
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-3">
                {/*                 <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </Button> */}
                {/*                 <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                    <Settings className="w-5 h-5" />
                </Button> */}
                <div className="w-px h-8 bg-border mx-2" />
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden md:block w-full max-w-52 truncate">
                        {user?.name}
                    </span>
                    <Avatar className="w-9 h-9 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                        <AvatarImage src={user?.picture || "/placeholder.svg?height=36&width=36"} />
                        <AvatarFallback className="bg-linear-to-br from-primary/80 to-primary/60 text-white text-sm">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
