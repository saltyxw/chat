
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export async function initAuth() {
    try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        console.log("Token refreshed on startup");
    } catch {
        console.log("No valid refresh token, user must log in");
    }
}