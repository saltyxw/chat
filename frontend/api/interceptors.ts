import { AxiosInstance } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const setupInterceptors = (api: AxiosInstance) => {
    api.interceptors.request.use((config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        config.withCredentials = true;
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            const authStore = useAuthStore.getState();

            if (!authStore.accessToken || originalRequest._retry) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401) {
                originalRequest._retry = true;
                try {
                    const refreshResponse = await api.post("/auth/refresh", {}, { withCredentials: true });
                    const newToken = refreshResponse.data.accessToken;
                    authStore.setAccessToken(newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    authStore.setAccessToken("");
                    window.location.href = "/login";
                    console.warn("Session expired — redirecting to login");
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};
