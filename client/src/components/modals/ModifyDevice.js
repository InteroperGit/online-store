import React, { useContext, useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown, Row, Col, Card } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchBrands, createDevice, updateDevice } from '../../http/deviceAPI';
import { Context } from '../../utils/context';
import { EMPTY_STRING } from '../../utils/consts';

const ModifyDevice = observer((props) => {
    const { show, hide, selectedDeviceId } = props;
    const { device } = useContext(Context);
    const [ name, setName ] = useState(EMPTY_STRING);
    const [ price, setPrice ] = useState(0);
    const [ rating, setRating ] = useState(0);
    const [ file, setFile ] = useState(null);
    const [ selectedType, setSelectedType ] = useState({});
    const [ selectedBrand, setSelectedBrand ] = useState(null);
    const [info, setInfo] = useState([]);

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    }

    const removeInfo = (number) => {
        setInfo(info.filter(item => item.number !== number));
    }

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    }

    const modifyDevice = () => {
        const formData = new FormData();
        if (selectedDeviceId) {
            formData.append('id', selectedDeviceId);
        }
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('rating', `${rating}`);
        formData.append('img', file);
        formData.append('typeId', selectedType.id);
        formData.append('brandId', selectedBrand.id);
        formData.append('info', JSON.stringify(info));

        const modifyHandler = !selectedDeviceId ? createDevice : updateDevice;

        modifyHandler(formData)
        .then(data => {
            device.setTotalDevicesCount(device.totalDevicesCount + 1);
            hide();
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

    const changeValue = (e) => {
        const valueName = e.target.dataset && e.target.dataset.id;
        const value = e.target.value;
        switch (valueName) {
            case 'name':
                setName(value);
                break;
            case 'price':
                setPrice(Number(value));
                break;
            case 'rating':
                setRating(Number(value));
                break;
            default:
                break;
        }
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => number === i.number ? { ...i, [key]: value } : i));
    }

    useEffect(() => {
        if (!show) {
            return;
        }

        const fetchParams = {
            filter: EMPTY_STRING,
            page: 1,
            limit: 100,
            orderKey: 'name',
            orderDirection: 'ASC'
        }

        Promise.all([
            fetchTypes(fetchParams),
            fetchBrands(fetchParams)
        ])
        .then(data => {
            const types = data[0].rows;
            const brands = data[1].rows;
            device.setTypes(types);
            device.setBrands(brands);

            if (selectedDeviceId) {
                const selectedDevice = device.getDevice(selectedDeviceId);
                setName(selectedDevice.name);
                setPrice(selectedDevice.price);
                setRating(selectedDevice.rating);

                const selectedBrand = device.getBrand(selectedDevice.deviceBrandId);
                if (selectedBrand) {
                    setSelectedBrand(selectedBrand);
                }
                
                const selectedType = device.getType(selectedDevice.deviceTypeId);
                if (selectedType) {
                    setSelectedType(selectedType);
                }
                
                const info = selectedDevice.info || [];
                info.forEach(i => i.number = i.id);
                setInfo(info);
            }
        });

    }, [show]);

    return (
        <Modal
            show={show}
            onHide={hide}
            size="lg"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {selectedDeviceId ? 'Обновить устройство' : 'Добавить устройство' }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown>
                        <Dropdown.Toggle>{ (selectedType && selectedType.name) || 'Выберите тип' }</Dropdown.Toggle>
                        <Dropdown.Menu>
                            { device.types.map(type => 
                                <Dropdown.Item key={type.id}
                                               onClick={ () => setSelectedType(type)}>
                                                   {type.name}
                                </Dropdown.Item>
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='mt-3'>
                        <Dropdown.Toggle>{ (selectedBrand && selectedBrand.name) || 'Выберите бренд' }</Dropdown.Toggle>
                        <Dropdown.Menu>
                            { device.brands.map(brand => 
                                <Dropdown.Item key={brand.id}
                                               onClick={ () => setSelectedBrand(brand) }>
                                                   {brand.name}
                                </Dropdown.Item>
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control 
                        data-id="name"
                        className="mt-3"
                        value={name}
                        placeholder="Введите название устройства"
                        type="string"
                        onChange={changeValue}>
                    </Form.Control>
                    <Form.Control 
                        data-id="price"
                        className="mt-3"
                        value={price}
                        placeholder="Введите стоимость устройства"
                        type="number"
                        onChange={changeValue}>
                    </Form.Control>
                    <Form.Control 
                        data-id="rating"
                        className="mt-3"
                        value={rating}
                        placeholder="Введите рейтинг устройства"
                        type="number"
                        onChange={changeValue}>
                    </Form.Control>
                    <Form.Control 
                        data-id="file"
                        className="mt-3"
                        type="file"
                        onChange={selectFile}>
                    </Form.Control>
                    <hr />
                    <Button 
                        variant="outline-dark"
                        onClick={ addInfo }>
                        Добавить новое свойство
                    </Button>
                    {
                        info.map(i => {
                            const key = i.number;
                            return  <Card className="mt-3 p-2" key={key}>
                                        <Row>
                                            <Col xs={12} md={4} className="mt-2 mt-sm-0">
                                                <Form.Control
                                                    value={i.title}
                                                    onChange={(e) => changeInfo('title', e.target.value, key)}
                                                    placeholder="Введите название" />
                                            </Col>
                                            <Col xs={12} md={6} className="mt-2 mt-sm-0">
                                                <Form.Control
                                                    value={i.description}
                                                    onChange={(e) => changeInfo('description', e.target.value, key)}
                                                    placeholder="Введите описание" />
                                            </Col>
                                            <Col xs={12} md={2} className="mt-2 mt-sm-0">
                                                <Button variant="outline-danger"
                                                        onClick={ () => removeInfo(key) }>
                                                    Удалить
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                        })
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-danger' onClick={ hide }>Закрыть</Button>
                <Button variant='outline-success' onClick={ modifyDevice }>{selectedDeviceId ? 'Обновить' : 'Добавить'}</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default ModifyDevice;