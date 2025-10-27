import axios from 'axios';
import { setupInterceptors } from './interceptors';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
    withCredentials: true,
});

setupInterceptors(api);

export default api;
