import api from "../axios";

export async function getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
}

export async function searchUserByName(name: string) {
    const res = await api.post('/users/search', { name });
    return res.data;
}