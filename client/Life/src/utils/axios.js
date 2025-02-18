import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3002/api',
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Отправка запроса с токеном:", config.headers.Authorization);
    return config;
});

export default instance;
