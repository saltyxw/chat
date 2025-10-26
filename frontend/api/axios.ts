import axios from 'axios';
import { setupInterceptors } from './interceptors';

const api = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true,
});

setupInterceptors(api);

export default api;
