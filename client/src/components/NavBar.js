import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Context } from '../utils/context';
import { fetchBasketAmount } from '../http/deviceAPI';
import { SHOP_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, BASKET_ROUTE } from '../utils/consts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const StyledNav = styled(Nav)`
    color: white;
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
    text-decoration: none;
    &:hover {
        color: orange!important;
    }
`;

const NavBar = observer(() => {
    const { user, device } = useContext(Context);

    const history = useHistory();

    const logOut = () => {
        if (!user.isAuth) {
            return;
        }

        user.setUser(false);
        user.setIsAuth(false);
        history.push(SHOP_ROUTE);
    }

    useEffect(() => {
        if (!user.isAuth)
        {
            return;
        }

        const fetchData = async () => {
            try {
                const { amount } = await fetchBasketAmount() || {};
                device.setTotalBasketDevicesCount(amount);
            } 
            catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    console.log(error.response.data.message); 
                }
                else {
                    console.log(`${error.message} ${error.stack}`);
                }
            }
        }

        fetchData();
    }, [user.isAuth]);

    return (
        <Navbar id="header-navbar" bg="dark" variant="dark" expand="md">
            <Container>
                <StyledNavbarBrand href={SHOP_ROUTE}>КупиДевайс</StyledNavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    { 
                        user.isAuth 
                            ?
                                <StyledNav className="ml-auto">
                                    <Button className='mt-2 mt-md-0' 
                                            data-testid="basketButton"
                                            variant='outline-light'
                                            onClick={ () => history.push(BASKET_ROUTE) }>
                                                <div className="d-flex flex-row justify-content-center">
                                                    { 
                                                        device.totalBasketDevicesCount > 0
                                                        ?
                                                            <div>
                                                                <div className="fa-layers fa-fw">
                                                                    <FontAwesomeIcon icon="shopping-cart" size="lg" />
                                                                    <span className="fa-layers-counter fa-3x" 
                                                                            style={{ 
                                                                                background: 'Tomato',
                                                                                right: -20,
                                                                                top: -15
                                                                            }}>
                                                                        { device.totalBasketDevicesCount }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        :
                                                            <FontAwesomeIcon icon="shopping-cart" size="lg" />
                                                    }
                                                    
                                                    <div className="d-block d-md-none ml-4">Корзина</div>
                                                </div>
                                    </Button>

                                    <Button className='ml-md-2 mt-2 mt-md-0' 
                                            variant='outline-light'
                                            data-testid="adminButton"
                                            onClick={ () => history.push(ADMIN_ROUTE) }>
                                                <div className="d-flex flex-row justify-content-center">
                                                    <FontAwesomeIcon icon="user-shield" size="lg" />
                                                    <div className="d-block d-md-none ml-4">Админка</div>
                                                </div>
                                    </Button>
                                    
                                    <Button className='ml-md-2 mt-md-0 mt-2' 
                                            variant='outline-light' 
                                            data-testid="logoutButton"
                                            onClick={ logOut }>
                                                <div className="d-flex flex-row justify-content-center">
                                                    <FontAwesomeIcon icon="door-open" size="lg" />
                                                    <div className="d-block d-md-none ml-4">Выйти</div>
                                                </div>
                                    </Button>
                                </StyledNav>
                            :
                                <StyledNav className="ml-auto">
                                    <Button variant='outline-light' onClick={ () => history.push(LOGIN_ROUTE) }>Авторизация</Button>
                                </StyledNav>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;