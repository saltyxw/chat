import api from "../axios";


export async function getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
}

export async function searchUserByName(name: string) {
    const res = await api.post('/users/search', { name });
    return res.data;
}

export async function changeUsername(newName: string) {
    await api.post('/users/change-name', { newName })
    router.replace('/profile')
}

export const changeAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/change-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};