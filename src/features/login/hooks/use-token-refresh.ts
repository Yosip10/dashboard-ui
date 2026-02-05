import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth.store";
import { useRefreshMutation } from "./use-refresh";

export const useTokenRefresh = () => {
    const { isAuthenticated, expiresAt } = useAuthStore();
    const { mutate: refreshSession, isPending } = useRefreshMutation();
    const lastRefreshTime = useRef<number>(0);

    useEffect(() => {
        // Guard checking isPending and validity of session
        if (!isAuthenticated || !expiresAt || isPending) return;

        const checkRefresh = () => {
            const now = Date.now();
            const diff = expiresAt - now;
            const secondsLeft = Math.floor(diff / 1000);

            // Cooldown logic: avoid refreshing if we already tried in the last 30 seconds
            const timeSinceLastRefresh = now - lastRefreshTime.current;
            const isOnCooldown = timeSinceLastRefresh < 30000;

            console.log(`[TokenRefresh] Checking: ${secondsLeft}s left. Cooldown: ${isOnCooldown ? 'Active' : 'Expired'} (${Math.floor(timeSinceLastRefresh / 1000)}s since last)`);

            // Trigger refresh exactly when 1 minute (60s) or less is left
            if (secondsLeft <= 60 && secondsLeft > 0 && !isPending && !isOnCooldown) {
                console.warn(`[TokenRefresh] Threshold reached (${secondsLeft}s). Triggering refresh...`);
                lastRefreshTime.current = now;
                refreshSession();
            } else if (secondsLeft <= 0) {
                console.error("[TokenRefresh] Token already expired.");
            }
        };

        // Increase check frequency to 10s for better accuracy
        const interval = setInterval(checkRefresh, 10000);

        // Immediate check on mount
        checkRefresh();

        return () => clearInterval(interval);
    }, [isAuthenticated, expiresAt, refreshSession, isPending]);
};
