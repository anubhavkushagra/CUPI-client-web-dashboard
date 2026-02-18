import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const api = axios.create({
    baseURL: API_URL
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const signup = async (name, email, password) => {
    return api.post('/auth/signup', { name, email, password });
};

export const getSupportedStocks = async () => {
    return api.get('/stocks/supported');
};

export const getStockHistory = async (ticker) => {
    return api.get(`/stocks/history/${ticker}`);
};
