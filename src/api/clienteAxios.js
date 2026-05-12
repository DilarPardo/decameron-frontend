import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace(/\/$/, ""),
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