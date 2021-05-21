import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import CreateType from '../modals/CreateType';
import CreateBrand from '../modals/CreateBrand';
import CreateDevice from '../modals/CreateDevice';

const TypeTable = () => {
    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [deviceVisible, setDeviceVisible] = useState(false);

    return (
        <Container>
            <Row>
                <Col className='d-flex flex-column'>
                    <Button variant='outline-dark' 
                            className='mt-2'
                            onClick={() => setTypeVisible(true)}>
                        Добавить тип
                    </Button>
                    
                    <Button variant='outline-dark' 
                            className='mt-2'
                            onClick={() => setBrandVisible(true)}>
                        Добавить бренд
                    </Button>
                    
                    <Button variant='outline-dark' 
                            className='mt-2'
                            onClick={() => setDeviceVisible(true)}>
                        Добавить устройство
                    </Button>
                    
                    <CreateType show={typeVisible} hide={() => setTypeVisible(false)} />
                    <CreateBrand show={brandVisible} hide={() => setBrandVisible(false)} />
                    <CreateDevice show={deviceVisible} hide={() => setDeviceVisible(false)} />
                </Col>
            </Row>
        </Container>
    );
}

export default TypeTable;