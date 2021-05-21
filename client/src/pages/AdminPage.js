import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import MenuBar from '../components/admin/MenuBar';
import AdminRouter from '../components/AdminRouter';
import { ADMIN_ROUTE, ADMIN_TYPE_ROUTE, ADMIN_BRAND_ROUTE, 
         ADMIN_DEVICE_ROUTE, ADMIN_USER_ROUTE } from '../utils/consts';

const menu = [{
        id: 1,
        name: 'Типы устройств',
        route: ADMIN_TYPE_ROUTE
    }, {
        id: 2,
        name: 'Бренды',
        route: ADMIN_BRAND_ROUTE
    }, {
        id: 3,
        name: 'Устройства',
        route: ADMIN_DEVICE_ROUTE
    }, {
        id: 4,
        name: 'Пользователи',
        route: ADMIN_USER_ROUTE
    }];

const getSelectedMenuItem = (pathname) => {
    switch (pathname) {
        case ADMIN_BRAND_ROUTE:
            return 2;
        case ADMIN_DEVICE_ROUTE:
            return 3;
        case ADMIN_USER_ROUTE:
            return 4;
        case ADMIN_TYPE_ROUTE:
        case ADMIN_ROUTE:
        default:
            return 1;
    }
}

const AdminPage = () => {
    const location = useLocation();

    const selectedMenuItem = getSelectedMenuItem(location.pathname);

    return (
        <Container>
            <Row>
                <Col md={4}>
                    <MenuBar menu={menu} selectedItem={selectedMenuItem} />
                </Col>
                <Col md={8} className='d-flex flex-column'>
                    <AdminRouter />
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPage;