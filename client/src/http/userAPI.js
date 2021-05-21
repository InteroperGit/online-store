import { $host, $authHost } from './index';
import jwt_decode from "jwt-decode";

const BASE_API_URL = '/api/user';

export const registration = async (email, password) => {
    const { data } = await $host.post(`${BASE_API_URL}/registration`, 
                                        { email, password, role: 'USER' });
    localStorage.setItem("token", data.token);
    return jwt_decode(data.token);
}

export const login = async (email, password) => {
    const { data } = await $host.post(`${BASE_API_URL}/login`, { email, password });
    localStorage.setItem("token", data.token);
    return jwt_decode(data.token);
}

export const check = async () => {
    const { data } = await $authHost.get(`${BASE_API_URL}/auth`);
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const fetchUsers = async (fetchOptions) => {
    const { data } = await $authHost.get(`${BASE_API_URL}`, { params: fetchOptions });
    return data;
}

export const createUser = async (user) => {
    const { data } = await $authHost.post(`${BASE_API_URL}`, user);
    return data;
}

export const updateUser = async (user) => {
    const { data } = await $authHost.put(`${BASE_API_URL}`, user);
    return data;
}

export const deleteUser = async (id) => {
    const { data } = await $authHost.delete(`${BASE_API_URL}`, { data: { id } });
    return data;
}