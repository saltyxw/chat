"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export function useInitAuth() {
    const router = useRouter();
    const { accessToken, setAccessToken } = useAuthStore();
    const { setUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const hasAttemptedRef = useRef(false);

    useEffect(() => {
        const path = window.location.pathname;
        if (path.startsWith("/auth")) return;
        if (path.startsWith("/reset-pass")) return;

        const refreshToken = async () => {
            if (isLoading || hasAttemptedRef.current) return;

            setIsLoading(true);
            hasAttemptedRef.current = true;

            try {
                const res = await api.post("/auth/refresh", {}, { withCredentials: true });
                const newToken = res.data.accessToken;
                setAccessToken(newToken);

                try {
                    const profileRes = await api.get("/users/profile");
                    setUser(profileRes.data);
                } catch (profileError) {
                    console.error("Failed to get profile:", profileError);
                }
            } catch {
                if (!window.location.pathname.startsWith("/auth")) {
                    router.replace("/auth");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (!accessToken) {
            refreshToken();
        }
    }, [router, accessToken, setAccessToken, setUser, isLoading]);

    return { isLoading };
}