import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import TypeBar from '../components/TypeBar';
import BrandBar from '../components/BrandBar';
import DeviceList from '../components/DeviceList';
import { Context } from '../utils/context';
import { fetchBrands, fetchTypes, fetchDevices } from '../http/deviceAPI';

const ShopPage = observer(() => {
    const { device } = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)

        Promise.all([
            fetchTypes(),
            fetchBrands(),
        ])
        .then((data) => {
            const { count: typesCount, rows: types = [] } = data[0];
            const { count: brandsCount, rows: brands = [] } = data[1];

            device.setTypes(types);
            device.setBrands(brands);

            if (typesCount > 0) {
                device.setSelectedType(types[0]);
            }

            if (brandsCount > 0) {
                device.setSelectedBrand(brands[0]);
            }

            fetchDevices()
            .then(({ count, rows }) => {
                device.setDevices(rows);
            })
            .finally(() => setLoading(false));
        })
        .catch(error => {
            setLoading(false);

            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
            }
        });
    }, []);

    return loading 
        ? <Spinner animation={ "grow" } />
        : (
        <Container>
            <Row className='mt-3'>
                <Col md={4}>
                    <TypeBar />
                </Col>
                <Col md={8}>
                    <BrandBar />
                    <DeviceList />
                </Col>
            </Row>
        </Container>
    );
});

export default ShopPage;