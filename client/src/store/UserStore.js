import { makeAutoObservable, keys, set, remove } from 'mobx';

const ELEMENTS_ON_PAGE = process.env.REACT_APP_ELEMENT_ON_PAGE_COUNT;

const orderFunctions = {
    orderByAsc: (orderKey) => {
        return (a, b) => {
            if (a[orderKey] > b[orderKey]) {
                return 1;
            }
        
            if (a[orderKey] < b[orderKey]) {
                return -1;
            }
        
            return 0;
        }
    },
    orderByDesc: (orderKey) => {
        return (a, b) => {
            if (a[orderKey] < b[orderKey]) {
                return 1;
            }
        
            if (a[orderKey] > b[orderKey]) {
                return -1;
            }
        
            return 0;
        }
    }
}

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = [];
        this._activePage = 1;
        this._totalUsersCount = 0;
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setUsers(users) {
        this._users = users;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get users() {
        return this._users;
    }

    getUser(id) {
        return this._users.filter(user => user.id === id)[0];
    }

    addUser(user) {
        const nextKey = keys(this._users).slice(-1)[0] + 1;
        set(this._users, nextKey, user);
        this.setTotalUsersCount(this.totalUsersCount + 1);
    }

    updateUser(updatingUser) {
        let user = this.getUser(updatingUser.id);
        const key = this._users.indexOf(user);
        user = { ...user, ...updatingUser };
        this.setUserByKey(key, user);
    }

    setUserByKey(key, user) {
        set(this._users, key, user);
    }

    removeUser(id) {
        const removingUser = this.getUser(id);
        const key = this._users.indexOf(removingUser);
        remove(this._users, key);
        this.setTotalUsersCount(this.totalUsersCount - 1);
    }

    setActivePage(page) {
        this._activePage = page;
    }

    setTotalUsersCount(count) {
        this._totalUsersCount = count;
    }

    setUserOrderKey(orderKey) {
        this._userOrderKey = orderKey || 'fullName';
    }

    setUserOrderDirection(orderDirection) {
        this._userOrderDirection = orderDirection || 'ASC';
    }

    get activePage() {
        return this._activePage;
    }

    get totalUsersCount() {
        return this._totalUsersCount;
    }

    get userOrderKey() {
        return this._userOrderKey;
    }

    get userOrderDirection() {
        return this._userOrderDirection;
    }

    get orderedUsers() {
        const orderByAsc = orderFunctions.orderByAsc(this._userOrdeKey);
        const orderByDesc = orderFunctions.orderByDesc(this._userOrdeKey);
        const orderedArray = this._users instanceof Array
            ? this._users.slice().sort(this._userOrderDirection === 'ASC' ? orderByAsc : orderByDesc)
            : [];

        return orderedArray.map((item, index) => {
            item['serialNumber'] = index + 1 + (this._activePage - 1) * ELEMENTS_ON_PAGE;
            return item;
        });
    }
}