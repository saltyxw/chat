import api from "../axios";

export const createOrGetPrivateChat = async (userId: number) => {
    const { data } = await api.post(`/chats/private/${userId}`);
    return data;
};

export const getUserChats = async () => {
    const { data } = await api.get(`/chats`);
    return data;
};
