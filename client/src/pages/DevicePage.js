import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../utils/context';
import { Container, Col, Row, Card, Button, Spinner, Alert } from 'react-bootstrap';
import DeviceInfoTable from '../components/DeviceInfoTable';
import { useParams } from 'react-router-dom';
import { fetchDevice, addDeviceToBasket, checkBasketDevice } from '../http/deviceAPI';
import { EMPTY_STRING, UNKNOWN_ERROR } from '../utils/consts';
import './DevicePage.css';

const DevicePage = observer(() => {
    const { id } = useParams();
    const { device, user } = useContext(Context);
    const [deviceInfo, setDeviceInfo] = useState({ info: [] });
    const [deviceExists, setDeviceExists] = useState(false);
    const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);
    const [loading, setLoading] = useState(true);

    const addToBasket = () => {
        const basketTask = {
            deviceId: id,
            amount: 1
        }

        addDeviceToBasket(basketTask)
        .then(data => {
            device.addBasketDevice(data);
        })
        .catch(error => { 
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
                setErrorMessage(UNKNOWN_ERROR); 
            }
        });
    }

    useEffect(() => {
        fetchDevice(id)
        .then((deviceInfo) => {
            setDeviceInfo(deviceInfo);
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
    }, [id]);

    useEffect(() => {
        if (!user.isAuth) {
            return;
        }

        checkBasketDevice(id)
        .then((data) => {
            const { exists } = data;
            setDeviceExists(exists);
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
            }
        })
    }, [device.totalBasketDevicesCount]);

    if (loading) {
        return <Spinner animation={ "grow" } />
    }

    return (
        <Container className='mt-3'>
            <Row>
                <Col md={6} lg={4} className='d-flex justify-content-center align-items-center'>
                    <Card className="devicePage-imageContainer shadow p-2">
                        <div style={{ width: '100%', 
                              height: 280, 
                              background: `no-repeat center/auto 100% url(${deviceInfo.imageUrl})` }} />
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <div className='d-flex flex-column align-items-center mt-3 mt-lg-0'>
                        <h2><span className="text-black-50">{deviceInfo.deviceBrand && deviceInfo.deviceBrand.name}</span> / <span>{deviceInfo.name}</span></h2>
                        <div className='d-flex align-items-center justify-content-center devicePage-star'>
                            {deviceInfo.rating}
                        </div>
                    </div>
                </Col>
                <Col md={12} lg={4}>
                    <Card className='d-flex flex-column align-items-center justify-content-around mt-3 mt-lg-0 devicePage-priceCard'>
                        <h3>{deviceInfo.price} рублей</h3>
                        {
                            !deviceExists
                            ? <Button variant='outline-dark'
                                      onClick={ addToBasket }>
                                  Добавить в корзину
                              </Button>
                            : <Alert variant="warning"
                                     className="d-flex flex-column justify-content-center"
                                     style={{ 
                                         margin: '0 10px',
                                         textAlign: 'center',
                                         height: 70,
                                         fontSize: '1rem',
                                         fontWeight: 'bold'
                                     }}>
                                  <div>Товар уже добавлен в корзину</div>
                               </Alert>
                        }
                        
                    </Card>
                </Col>
            </Row>
            <Row className='d-flex flex-column m-3'>
                <DeviceInfoTable info={deviceInfo.info || []} />
            </Row>
        </Container>
    );
});

export default DevicePage;