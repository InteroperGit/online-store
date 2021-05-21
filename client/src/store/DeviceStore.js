import { set, keys, computed, makeAutoObservable, remove } from 'mobx';

const ELEMENTS_ON_PAGE = process.env.REACT_APP_ELEMENT_ON_PAGE_COUNT;

const orderFunctions = {
    orderByAsc: (orderProp) => {
        return (a, b) => {
            if (a[orderProp] > b[orderProp]) {
                return 1;
            }
        
            if (a[orderProp] < b[orderProp]) {
                return -1;
            }
        
            return 0;
        }
    },
    orderByDesc: (orderProp) => {
        return (a, b) => {
            if (a[orderProp] < b[orderProp]) {
                return 1;
            }
        
            if (a[orderProp] > b[orderProp]) {
                return -1;
            }
        
            return 0;
        }
    }
}

export default class DeviceStore {
    constructor() {
        this._types = [];

        this._brands = [];

        this._devices = [
            /*
            { id: 1, name: "IPhone 11 Pro", price: 90000, rating: 5, img: '', imageUrl: 'https://via.placeholder.com/150' },
            { id: 2, name: "IPhone 12 Pro", price: 100000, rating: 5, img: '', imageUrl: 'https://via.placeholder.com/150' },
            { id: 3, name: "IPhone 7", price: 10000, rating: 5, img: '', imageUrl: 'https://via.placeholder.com/150' },
            { id: 4, name: "IPhone 5", price: 50000, rating: 5, img: '', imageUrl: 'https://rklm-online-store.s3.eu-central-1.amazonaws.com/Apple/%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD%D1%8B/b185614e-4ee4-40ca-b95c-5a77c9e2685f.jpg' },
            { id: 5, name: "IPhone 6", price: 50000, rating: 5, img: '', imageUrl: 'https://via.placeholder.com/150' },
            { id: 6, name: "IPhone 8", price: 50000, rating: 5, img: '', imageUrl: 'https://via.placeholder.com/150' },
            */
        ];

        /**
         * TYPES
         */
        this._selectedType = this._types[0];

        this._totalTypesCount = 0;

        this._typeOrderKey = 'name';

        this._typeOrderDirection = 'ASC';

        this._typeActivePage = 1;

        /**
         * BRANDS
         */

        this._selectedBrand = this._brands[0];

        this._totalBrandsCount = 0;

        this._brandOrderKey = 'name';

        this._brandOrderDirection = 'ASC';

        this._brandActivePage = 1;
        
        /**
         * DEVICES
         */

        this._totalDevicesCount = 0;

        this._deviceOrderKey = 'name';

        this._deviceOrderDirection = 'ASC';

        this._deviceActivePage = 1;

        this._filteredDevices = [];

        /**
         * BASKET
         */

        this._totalBasketDevicesCount = 0;

        this._basketDevices = [];

        makeAutoObservable(this, {
            orderedTypes: computed
        });
    }

    /**
     * TYPES
     */

    /**
     * 
     * @param {*} types 
     */
    setTypes(types) {
        this._types = types;
    }

    addType(type) {
        const nextKey = keys(this._types).slice(-1)[0] + 1;
        set(this._types, nextKey, type);
        this.setTotalTypesCount(this.totalTypesCount + 1);
    }

    updateType(updatingType) {
        const type = this.getType(updatingType.id);
        type.name = updatingType.name;
    }

    setType(key, type) {
        set(this._types, key, type);
    }

    removeType(id) {
        const removingType = this.getType(id);
        const key = this._types.indexOf(removingType);
        remove(this._types, key);
        this.setTotalTypesCount(this.totalTypesCount - 1);
    }

    setTypeActivePage(page) {
        this._typeActivePage = page;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    setTotalTypesCount(count) {
        this._totalTypesCount = count;
    }

    setTypeOrderKey(orderKey) {
        this._typeOrderKey = orderKey || 'name';
    }

    setTypeOrderDirection(orderDirection) {
        this._typeOrderDirection = orderDirection || 'ASC';
    }

    get types() {
        return this._types;
    }

    getType(id) {
        return this._types.filter(type => type.id === id)[0];
    }

    get typeActivePage() {
        return this._typeActivePage;
    }

    get selectedType() {
        return this._selectedType;
    }

    get totalTypesCount() {
        return this._totalTypesCount;
    }

    get typeOrderKey() {
        return this._typeOrderKey;
    }

    get typeOrderDirection() {
        return this._typeOrderDirection;
    }

    get orderedTypes() {
        const orderProp = 'name';
        const orderByAsc = orderFunctions.orderByAsc(orderProp);
        const orderByDesc = orderFunctions.orderByDesc(orderProp);
        const orderedArray = this._types instanceof Array
            ? this._types.slice().sort(this._typeOrderDirection === 'ASC' ? orderByAsc : orderByDesc)
            : [];

        return orderedArray.map((item, index) => {
            item['serialNumber'] = index + 1 + (this._typeActivePage - 1) * ELEMENTS_ON_PAGE;
            return item;
        });
    }

    /**
     * BRANDS
     */

    setBrands(brands) {
        this._brands = brands;
    }

    addBrand(brand) {
        const nextKey = keys(this._brands).slice(-1)[0] + 1;
        set(this._brands, nextKey, brand);
        this.setTotalBrandsCount(this.totalBrandsCount + 1);
    }

    updateBrand(updatingBrand) {
        const brand = this.getBrand(updatingBrand.id);
        brand.name = updatingBrand.name;
    }

    setBrand(key, brand) {
        set(this._brands, key, brand);
    }

    removeBrand(id) {
        const removingBrand = this.getBrand(id);
        const key = this._brands.indexOf(removingBrand);
        remove(this._brands, key);
        this.setTotalBrandsCount(this.totalBrandsCount - 1);
    }

    setBrandActivePage(page) {
        this._brandActivePage = page;
    }

    setSelectedBrand(brand) {
        this._selectedBrand = brand;
    }

    setTotalBrandsCount(count) {
        this._totalBrandsCount = count;
    }

    setBrandOrderKey(orderKey) {
        this._brandOrderKey = orderKey || 'name';
    }

    setBrandOrderDirection(orderDirection) {
        this._brandOrderDirection = orderDirection || 'ASC';
    }

    get brands() {
        return this._brands;
    }

    getBrand(id) {
        return this._brands.find(brand => brand.id === id);
    }

    get brandActivePage() {
        return this._brandActivePage;
    }

    get selectedBrand() {
        return this._selectedBrand;
    }

    get totalBrandsCount() {
        return this._totalBrandsCount;
    }

    get brandOrderKey() {
        return this._brandOrderKey;
    }

    get brandOrderDirection() {
        return this._brandOrderDirection;
    }

    get orderedBrands() {
        const orderProp = 'name';
        const orderByAsc = orderFunctions.orderByAsc(orderProp);
        const orderByDesc = orderFunctions.orderByDesc(orderProp);
        const orderedArray = this._brands instanceof Array
            ? this._brands.slice().sort(this._brandOrderDirection === 'ASC' ? orderByAsc : orderByDesc)
            : [];

        return orderedArray.map((item, index) => {
            item['serialNumber'] = index + 1 + (this._brandActivePage - 1) * ELEMENTS_ON_PAGE;
            return item;
        });
    }

    /**
     * DEVICES
     */

    setDevices(devices) {
        this._devices = devices;
    }

    addDevice(device) {
        set(this._devices, device);
    }
    
    updateDevice(updatingDevice) {
        const device = this.getDevice(updatingDevice.id);
        device.name = updatingDevice.name;
    }

    setDevice(key, device) {
        set(this._devices, key, device);
    }

    removeDevice(id) {
        const removingDevice = this.getDevice(id);
        const key = this._devices.indexOf(removingDevice);
        remove(this._devices, key);
        this.setTotalDevicesCount(this.totalDevicesCount - 1);
    }

    setDeviceActivePage(page) {
        this._deviceActivePage = page;
    }

    setSelectedDevice(device) {
        this._selecteDevice = device;
    }

    setTotalDevicesCount(count) {
        this._totalDevicesCount = count;
    }

    setDeviceOrderKey(orderKey) {
        this._deviceOrderKey = orderKey || 'name';
    }

    setDeviceOrderDirection(orderDirection) {
        this._deviceOrderDirection = orderDirection || 'ASC';
    }

    setFilteredDevices(filteredDevices) {
        this._filteredDevices = filteredDevices || [];
    }

    get devices() {
        return this._devices;
    }

    getDevice(id) {
        return this._devices.find(device => device.id === id);
    }

    get deviceActivePage() {
        return this._deviceActivePage;
    }

    get selectedDevice() {
        return this._selectedDevice;
    }

    get totalDevicesCount() {
        return this._totalDevicesCount;
    }

    get deviceOrderKey() {
        return this._deviceOrderKey;
    }

    get deviceOrderDirection() {
        return this._deviceOrderDirection;
    }

    get filteredDevices() {
        return this._filteredDevices;
    }

    get orderedDevices() {
        const orderProp = 'name';
        const orderByAsc = orderFunctions.orderByAsc(orderProp);
        const orderByDesc = orderFunctions.orderByDesc(orderProp);
        const orderedArray = this._devices instanceof Array
            ? this._devices.slice().sort(this._deviceOrderDirection === 'ASC' ? orderByAsc : orderByDesc)
            : [];

        return orderedArray.map((item, index) => {
            item['serialNumber'] = index + 1 + (this._deviceActivePage - 1) * ELEMENTS_ON_PAGE;
            return item;
        });
    }

    /**
     * BASKET
     */

    setBasketDevices(basketDevices) {
        this._basketDevices = basketDevices || [];
    }

    get basketDevices() {
        return this._basketDevices;
    }

    get totalBasketDevicesCount() {
        return this._totalBasketDevicesCount;
    }

    setTotalBasketDevicesCount(count) {
        this._totalBasketDevicesCount = count;
    }

    getBasketDevice(id) {
        return this._basketDevices.find(device => device.id === id);
    }

    addBasketDevice(basketDevice) {
        set(this._basketDevices, basketDevice);
        this.setTotalBasketDevicesCount(this.totalBasketDevicesCount + 1);
    }

    removeBasketDevice(deviceId) {
        const removingDevice = this.getBasketDevice(deviceId);
        const key = this._basketDevices.indexOf(removingDevice);
        remove(this._basketDevices, key);
        this.setTotalBasketDevicesCount(this.totalBasketDevicesCount - 1);
    }
}