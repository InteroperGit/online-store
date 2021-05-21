import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { fetchBasket, deleteDeviceFromBasket } from '../http/deviceAPI';
import { Spinner, Table, Container, Card, Button } from 'react-bootstrap';
import { Context } from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NAVBAR_HEIGHT } from '../utils/consts';

const StyledCard = styled(Card)`
    max-width: 800px;
    margin: 0 auto;
`;

const StyledTd = styled.td`
    vertical-align: middle!important;
`;

const getCardMarginTop = () => (window.innerHeight - NAVBAR_HEIGHT - 300) / 2;

const BasketPage = observer(() => {
    const { user, device } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const isAuth = user.isAuth;

    const onDelete = (itemId) => {
        deleteDeviceFromBasket(itemId)
        .then(() => {
            device.removeBasketDevice(itemId);
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
            }
        })
    }

    useEffect(() => {
        if (!isAuth) {
            return;
        }

        setLoading(true);

        fetchBasket()
        .then(({ rows }) => {
            device.setBasketDevices(rows);
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
            }
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spinner animation={ "grow" } />
    }

    return (
        <Container  className="d-flex">
            <StyledCard className="p-5 shadow d-none d-md-block"
                style={{ 'marginTop': getCardMarginTop() }}>
                <h2>Корзина:</h2>
                <Table  striped 
                        bordered 
                        hover>
                    <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th>Наименование</th>
                            <th>Кол-во</th>
                            <th>Цена</th>
                            <th>Стоимость</th>
                            <th>Управление</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            device.basketDevices.map((item, index) => (
                                <tr key={item.id}>
                                    <StyledTd>{ index + 1 }</StyledTd>
                                    <StyledTd>
                                        { item.device && item.device.deviceBrand && item.device.deviceBrand.name } 
                                        &nbsp;
                                        { item.device && item.device.name }
                                    </StyledTd>
                                    <StyledTd>{ item.amount }</StyledTd>
                                    <StyledTd>{ item.device && item.device.price } </StyledTd>
                                    <StyledTd>{ item.amount * (item.device && item.device.price) } </StyledTd>
                                    <StyledTd>                        
                                        <Button data-id={item.id} 
                                                variant='outline-danger' 
                                                size='sm' 
                                                className='ml-2'
                                                onClick={ (e) => onDelete(parseInt(e.currentTarget.dataset.id)) }>
                                                    <FontAwesomeIcon icon="times-circle" size="lg" />
                                        </Button>
                                    </StyledTd>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </StyledCard>

            <StyledCard className="mt-3 mb-3 p-2 shadow d-block d-md-none">
                <h2 className="m-2">Корзина:</h2>
                <div className="d-flex justify-content-center flex-wrap">
                    {
                        device.basketDevices.map((item, index) => (
                            <Card className="m-2 flex-grow-1" key={index}>
                                <Card.Body>
                                    <Card.Title>
                                        {item.device && item.device.deviceBrand && item.device.deviceBrand.name}
                                        &nbsp;
                                        {item.device && item.device.name}
                                    </Card.Title>

                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Наименование</th>
                                                <th>Значение</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Кол-во</td>
                                                <td>{ item.amount }</td>
                                            </tr>
                                            <tr>
                                                <td>Цена</td>
                                                <td>{ item.device && item.device.price }</td>
                                            </tr>
                                            <tr>
                                                <td>Стоимость</td>
                                                <td>{ item.amount * (item.device && item.device.price) }</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Button variant="outline-danger"
                                            data-id={item.id}
                                            onClick={ (e) => onDelete(parseInt(e.currentTarget.dataset.id)) }>
                                                Удалить
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </div>
            </StyledCard>
        </Container>
    );
});

export default BasketPage;