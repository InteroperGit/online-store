import axios from 'axios';

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);

//fix Android 'network error'
axios.interceptors.request.use((config) => {
    if (config.method !== 'get') {
        config.data = JSON.stringify(config.data);
    }
    if (typeof config.params === 'undefined') {
        config.params = {}
    }
});

export {
    $host,
    $authHost
}