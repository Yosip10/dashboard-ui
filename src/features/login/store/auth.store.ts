import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState, User } from "../types/auth";
import { logoutService } from "../api/auth.service";


interface AuthStore extends AuthState {
    setUser: (user: User | null) => void;
    expiresAt: number | null;
    refreshExpiresAt: number | null;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            expiresAt: null,
            refreshExpiresAt: null,
            setUser: (user) => {
                const expiresAt = user?.expires_in
                    ? Date.now() + (user.expires_in * 1000)
                    : null;

                // Extract expiration from refresh_token JWT if refresh_expires_in is missing/invalid
                let refreshExpiresAt = user?.refresh_expires_in
                    ? Date.now() + (user.refresh_expires_in * 1000)
                    : null;

                if (user?.refresh_token) {
                    const decoded = parseJwt(user.refresh_token);
                    if (decoded?.exp) {
                        refreshExpiresAt = decoded.exp * 1000;
                    }
                }

                set({
                    user,
                    expiresAt,
                    refreshExpiresAt,
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
