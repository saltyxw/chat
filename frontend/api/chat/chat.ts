import api from "../axios";
import { useAuthStore } from "@/store/useAuthStore";

export const createOrGetPrivateChat = async (userId: number) => {
    const { data } = await api.post(`/chats/private/${userId}`);
    return data;
};

export const getUserChats = async () => {
    const { data } = await api.get(`/chats`);
    return data;
};

export const getChatPartners = async () => {
    try {
        const { data } = await api.get('/chats/partners')
        return data;
    } catch (err) {
        console.error('Failed to fetch chat partners:', err);
        return [];
    }
};
