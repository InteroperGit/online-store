import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Form, Card, Button, Row, Toast } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { REGISTRATION_ROUTE, SHOP_ROUTE, NAVBAR_HEIGHT } from '../utils/consts';
import { login } from '../http/userAPI';
import { Context } from '../utils/context';
import './AuthPage.css';

const getContainerHeight = () => window.innerHeight - NAVBAR_HEIGHT;

const getCardMarginTop = () => (window.innerHeight - NAVBAR_HEIGHT - 300) / 2;

const LoginPage = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageShow, setErrorMessageShow] = useState(false);
    const [loginDisabled, setLoginDisabled] = useState(true);

    const loginClick = async () => {
        try {
            const data = await login(email, password);
            user.setUser(data);
            user.setIsAuth(true);
            console.log(user);
            history.push(SHOP_ROUTE);
        } 
        catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            }
            else {
                setErrorMessage(error.message);
            }

            setErrorMessageShow(true);
            setTimeout(() => {
                setErrorMessageShow(false);
            }, 3000)
        }
    }

    const checkLoginDisabled = () => {
        setLoginDisabled(!(email && password));
    }

    return (
        <Container style={{ height: getContainerHeight() }}>
            <Toast show={errorMessageShow} 
                className="m-2 rounded shadow"
                style={{ position: 'fixed', top: NAVBAR_HEIGHT, right: 0 }}>
                <Toast.Header style={{ background: 'red', color: 'white' }}>
                    {errorMessage}
                </Toast.Header>
            </Toast>

            <Card className='container-card p-5 shadow'
                  style={{ 'marginTop': getCardMarginTop() }}>
                <h2 className="m-auto">Авторизация</h2>
                <Form className='d-flex flex-column'>
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите email...'
                        value={email}
                        onChange={ e => setEmail(e.target.value) }
                        onKeyUp={ () => checkLoginDisabled() }
                    />
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите пароль...'
                        value={password}
                        onChange={ e => setPassword(e.target.value) }
                        onKeyUp={ e => checkLoginDisabled() }
                        type="password"
                    />
                    <Row className='d-flex 
                                    flex-column flex-md-row 
                                    justify-content-center justify-content-md-between 
                                    align-items-center 
                                    mt-3 pr-3 pl-3'>
                        { 
                            <div> 
                                Нет аккаунта? <NavLink className="d-inline" to={REGISTRATION_ROUTE}>Регистрация</NavLink>
                            </div>
                        }
                        
                        <Button variant="outline-dark" 
                                className="align-self-stretch align-self-sm-end mt-3 mt-sm-0"
                                disabled={loginDisabled}
                                onClick={ () => loginClick() }>
                            Войти
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default LoginPage;