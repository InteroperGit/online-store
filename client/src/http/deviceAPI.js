import { $host, $authHost } from './index';

/*
* DEVICE TYPES
*/

export const createType = async (type) => {
    const { data } = await $authHost.post('api/devicetype', type);
    return data;
}

export const updateType = async(type) => {
    const { data } = await $authHost.put('api/devicetype', type);
    return data;
}

export const deleteType = async(id) => {
    const { data } = await $authHost.delete('api/devicetype', { data: { id } });
    return data;
}

export const fetchTypes = async (fetchOptions) => {
    const { data } = await $host.get('api/devicetype', { params: fetchOptions });
    return data;
}

/*
* DEVICE BRANDS
*/

export const createBrand = async (brand) => {
    const { data } = await $authHost.post('api/devicebrand', brand);
    return data;
}

export const updateBrand = async (brand) => {
    const { data } = await $authHost.put('api/devicebrand', brand);
    return data;
}

export const deleteBrand = async(id) => {
    const { data } = await $authHost.delete('api/devicebrand', { data: { id } });
    return data;
}

export const fetchBrands = async (fetchOptions) => {
    const { data } = await $host.get('api/devicebrand', { params: fetchOptions });
    return data;
}

/*
* DEVICES
*/

export const createDevice = async (device) => {
    const { data } = await $authHost.post(`api/device`, device);
    return data;
}

export const updateDevice = async (device) => {
    const { data } = await $authHost.put(`api/device`, device);
    return data;
}

export const deleteDevice = async(id) => {
    const { data } = await $authHost.delete('api/device', { data: { id } });
    return data;
}

export const fetchDevice = async (id) => {
    const { data } = await $host.get(`api/device/${id}`);
    return data;
}

export const fetchDevices = async (fetchOptions) => {
    const { data } = await $host.get(`api/device`, { params: fetchOptions });
    return data;
}

/**
 * BASKET
 */

export const addDeviceToBasket = async (basketTask) => {
    const { data } = await $authHost.post(`api/basket`, basketTask);
    return data;
}

export const deleteDeviceFromBasket = async (basketDeviceId) => {
    const { data } = await $authHost.delete(`api/basket`, { data: { basketDeviceId } });
    return data;
}

/*

    const data = {
        count: 1,
        rows: [{
            id: 1
            device: {
                id: 13,
                deviceBrand: {
                    name: 'Apple'
                },
                deviceType: {
                    name: 'Смартфоны'
                },
                name: 'SE-2',
                price: 10000
            },
            amount: 1
        }]
    };

*/
export const fetchBasket = async() => {
    const { data } = await $authHost.get(`api/basket`);
    return data;
}

export const fetchBasketAmount = async() => {
    const { data } = await $authHost.get(`api/basket/amount`) || {};
    return data;
}

export const checkBasketDevice = async(deviceId) => {
    const { data } = await $authHost.get('api/basket/check', { params: { deviceId } });
    return data;
}