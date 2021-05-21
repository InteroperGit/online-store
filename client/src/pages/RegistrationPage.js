import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Form, Card, Button, Row, Alert, Toast } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { LOGIN_ROUTE,  SHOP_ROUTE, NAVBAR_HEIGHT } from '../utils/consts';
import { registration } from '../http/userAPI';
import { Context } from '../utils/context';
import './AuthPage.css';

const getContainerHeight = () => window.innerHeight - NAVBAR_HEIGHT;

const getCardMarginTop = () => (window.innerHeight - NAVBAR_HEIGHT - 400) / 2;

const SHOW_ERROR_TIMEOUT = 3000;

const RegistrationPage = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [wrongPasswords, setWrongPasswords] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageShow, setErrorMessageShow] = useState(false);

    const registrationClick = async () => {
        if (password !== password2) {
            setWrongPasswords(true);
            return;
        }
        else {
            setWrongPasswords(false);
        }

        try {
            const data = await registration(email, password);
            user.setUser(data);
            user.setIsAuth(true);
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
            }, SHOW_ERROR_TIMEOUT)
        }
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
                <h2 className="m-auto">Регистрация</h2>
                <Form className='d-flex flex-column'>
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите email...'
                        value={email}
                        onChange={ e => setEmail(e.target.value) }
                    />
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите пароль...'
                        value={password}
                        onChange={ e => setPassword(e.target.value) }
                        type="password"
                    />
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите пароль еще раз...'
                        value={password2}
                        onChange={ e => setPassword2(e.target.value) }
                        type="password"
                    />
                    { 
                        wrongPasswords && <Alert variant="danger"
                                               className="mt-3">
                                            Пароли не совпадают
                                          </Alert> 
                    }
                    <Row className='d-flex 
                                    flex-column flex-md-row 
                                    justify-content-center justify-content-md-between 
                                    align-items-center 
                                    mt-3 pr-3 pl-3'>
                        { 
                            <div> 
                                Есть аккаунт? <NavLink className='d-inline' to={LOGIN_ROUTE}>Войти</NavLink>
                            </div>
                        }
                        
                        <Button variant="outline-dark" 
                                className="align-self-stretch align-self-sm-end mt-3 mt-sm-0"
                                onClick={ () => registrationClick() }>
                            Зарегистрироваться
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default RegistrationPage;