"use client";

import { useAuthStore } from "@/features/login/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Search, Bell, Settings, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuthStore();
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <header className="h-16 border-b border-gray-200 bg-background px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
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
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar..."
                    className="pl-10 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all duration-200"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                    <Settings className="w-5 h-5" />
                </Button>
                <div className="w-px h-8 bg-border mx-2" />
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden md:block">
                        {user?.name}
                    </span>
                    <Avatar className="w-9 h-9 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                        <AvatarImage src={user?.picture || "/placeholder.svg?height=36&width=36"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/60 text-white text-sm">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
