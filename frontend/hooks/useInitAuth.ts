"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export function useInitAuth() {
    const router = useRouter();


    useEffect(() => {
        const accessToken = useAuthStore.getState().accessToken;


        const refreshToken = async () => {
            try {
                const res = await api.post("/auth/refresh", {}, { withCredentials: true });
                const newToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newToken);
            } catch {
                router.replace("/auth");
            }
        };

        refreshToken();
    }, [router]);
}
