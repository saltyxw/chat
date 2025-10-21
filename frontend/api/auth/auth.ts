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