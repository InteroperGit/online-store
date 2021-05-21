import React from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import './DeviceItem.css';
import star from '../assets/png/star.png'; 
import { useHistory } from 'react-router-dom';
import { DEVICE_ROUTE } from '../utils/consts';

const STAR_WIDTH = 15;
const STAR_HEIGHT = 15;

const DeviceItem = ({ device }) => {
    const history = useHistory();

    return (
        <Col className='mb-3 flex-grow-0' onClick={ () => history.push(`${DEVICE_ROUTE}/${device.id}`) }>
            <Card className='deviceItem-card p-2' border='light-gray'>
                <div style={{ width: '100%', 
                              height: 150, 
                              background: `no-repeat center/auto 100% url(${device.imageUrl})` }} />
                
                <div className='text-black-50 d-flex justify-content-between'>
                    <div className='ml-1'>{device.deviceBrand.name}</div>
                    <div className='d-flex align-items-center mr-1'>
                        <div>{device.rating}</div>
                        <Image width={STAR_WIDTH} height={STAR_HEIGHT} src={star} className='ml-1' />
                    </div>
                </div>
                <div>
                    {device.name}
                </div>
            </Card>
        </Col>
    );
}

export default DeviceItem;