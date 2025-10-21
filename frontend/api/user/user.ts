import api from "../axios";

export async function getProfile() {
    await api.get('/users/profile').then(function (res) {
        console.log(res.data)
    })
}

export async function searchUserByName(name: string) {
    const res = await api.post('/users/search', { name });
    return res.data;
}