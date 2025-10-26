import { LoginUserType, RegisterUserType } from "@/types/auth";
import api from "../axios";
import { useAuthStore } from "@/store/useAuthStore"


export async function registerUser(data: RegisterUserType) {
    await api.post('auth/register', data)
}

export async function loginUser(data: LoginUserType) {
    const res = await api.post('auth/login', data)
    useAuthStore.getState().setAccessToken(res.data.access_token)

}

export async function logout() {
    await api.post('auth/logout')
}

export async function changePassword(currentPassword: string, newPassword: string) {
    await api.post('/auth/change-password', { currentPassword, newPassword })
}

export async function requestPasswordReset(email: string) {
    return api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, password: string) {
    return api.post("/auth/reset-password", { token, password });
}