import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../utils/context';
import { Row, Card, Spinner } from 'react-bootstrap';
import DeviceItem from './DeviceItem';
import { fetchDevices } from '../http/deviceAPI';
import './DeviceList.css';

const DeviceList = observer(() => {
    const { device } = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        let fetchParams = {
            deviceTypeId: device.selectedType && device.selectedType.id,
            deviceBrandId: device.selectedBrand && device.selectedBrand.id
        };

        fetchDevices(fetchParams)
        .then(data => device.setFilteredDevices(data.rows || []))
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
            }
        })
        .finally(() => setLoading(false));
    }, [device.selectedType, device.selectedBrand]);

    if (loading) {
        return <Spinner animation={ "grow" } />
    }

    return device.filteredDevices.length > 0 ? 
    (
        <Row>
            <div className='d-flex flex-wrap justify-content-start deviceList-deviceContainer'>
                {
                    device.filteredDevices.map(device =>
                        <DeviceItem key={device.id} device={device} />
                    )
                }
            </div>
        </Row>
    )
    :
    (
        <Row className="d-flex justify-content-center" style={ { height: 500 } }>
            <Card className="d-flex flex-column justify-content-center shadow text-center" style={{ height: 300, margin: 'auto 20px' }}>
                <h1 className="m-3">Устройства не найдены</h1>
            </Card>
        </Row>
    )
});

export default DeviceList;