import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState, User } from "../types/auth";
import { logoutService } from "../api/auth.service";


interface AuthStore extends AuthState {
    setUser: (user: User | null) => void;
    expiresAt: number | null;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            expiresAt: null,
            setUser: (user) => {
                const expiresAt = user?.expires_in
                    ? Date.now() + (user.expires_in * 1000)
                    : null;
                set({
                    user,
                    expiresAt,
                    isAuthenticated: !!user,
                    error: null,
                })
            },

            setLoading: (isLoading) => set({ isLoading }),

            logout: () => {
                const user = useAuthStore.getState().user;
                if (user) {
                    logoutService(user.accountId, user.refresh_token);
                    set({ user: null, isAuthenticated: false, error: null });
                    localStorage.removeItem("remember");
                    localStorage.removeItem("current_tenant_config");
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
