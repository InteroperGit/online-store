import AdminPage from './pages/AdminPage';
import BasketPage from './pages/BasketPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DevicePage from './pages/DevicePage';
import { ADMIN_ROUTE, ADMIN_TYPE_ROUTE, ADMIN_BRAND_ROUTE, ADMIN_DEVICE_ROUTE, ADMIN_USER_ROUTE, BASKET_ROUTE, 
         DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from './utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: AdminPage
    },
    {
        path: ADMIN_TYPE_ROUTE,
        component: AdminPage
    },
    {
        path: ADMIN_BRAND_ROUTE,
        component: AdminPage
    },
    {
        path: ADMIN_DEVICE_ROUTE,
        component: AdminPage
    },
    {
        path: ADMIN_USER_ROUTE,
        component: AdminPage
    },
    {
        path: BASKET_ROUTE,
        component: BasketPage
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        component: ShopPage
    },
    {
        path: LOGIN_ROUTE,
        component: LoginPage
    },
    {
        path: REGISTRATION_ROUTE,
        component: RegistrationPage
    },
    {
        path: `${DEVICE_ROUTE}/:id`,
        component: DevicePage   
    },
]