import axios from 'axios';

const URL_DIRECTA = 'https://decameron-backend-production-c56d.up.railway.app/api';

const clienteAxios = axios.create({
    baseURL: URL_DIRECTA,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

clienteAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

clienteAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default clienteAxios;