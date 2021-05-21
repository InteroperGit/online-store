import React from 'react';
import ItemPanel from '../admin/ItemPanel';
import { fetchDevices, createDevice, 
         updateDevice, deleteDevice } from '../../http/deviceAPI';

const CREATE_ITEM_HEADER_TITLE = 'Добавить устройство';
const UPDATE_ITEM_HEADER_TITLE = 'Изменить устройство';
const DELETE_ITEM_HEADER_TITLE = 'Удалить устройство';
const CREATE_ITEM_CONFIRM_BUTTON_TITLE = 'Добавить';
const UPDATE_ITEM_CONFIRM_BUTTON_TITLE = 'Изменить';
const DELETE_ITEM_CONFIRM_BUTTON_TITLE = 'Удалить';

const DevicePanel = () => {
    return (
        <ItemPanel 
                mode="device"
                storeParams={{
                    storeName: 'device',
                    getItem: 'getDevice',
                    itemOrderDirection: 'deviceOrderDirection',
                    totalItemsCount: 'totalDevicesCount',
                    setItemOrderDirectionHandler: 'setDeviceOrderDirection',
                    setItemsHandler: 'setDevices',
                    setTotalItemsCountHandler: 'setTotalDevicesCount',
                    itemOrderKey: 'name',
                    orderedItems: 'orderedDevices',
                    addItemHandler: 'addDevice',
                    updateItemHandler: 'updateDevice',
                    deleteItemHandler: 'removeDevice',
                    activePage: 'deviceActivePage',
                    setActivePageHandler: 'setDeviceActivePage'
                }}
                apiHandlers={{
                    'get': fetchDevices,
                    'create': createDevice,
                    'update': updateDevice,
                    'delete': deleteDevice
                }}
                formConfig={[
                    {
                        field: 'name',
                        type: 'text',
                        label: 'Наименование',
                        control: {
                            placeholder: 'Введите название устройства'
                        }
                    }
                ]}
                tableConfig={{
                    "headers": [
                        { 
                            type: 'basic',
                            title: '#'
                        },
                        {
                            type: 'order',
                            title: 'Наименование'
                        }
                    ],
                    "data": [
                        (device) => device.serialNumber,
                        (device) => <div><strong>{device.deviceType.name}</strong> / {device.deviceBrand.name} {device.name}</div>
                    ]
                }}
                modalConfig={{
                    'create': {
                        headerTitle: CREATE_ITEM_HEADER_TITLE,
                        confirmButtonTitle: CREATE_ITEM_CONFIRM_BUTTON_TITLE
                    },
                    'update': {
                        headerTitle: UPDATE_ITEM_HEADER_TITLE,
                        confirmButtonTitle: UPDATE_ITEM_CONFIRM_BUTTON_TITLE
                    },
                    'delete': {
                        headerTitle: DELETE_ITEM_HEADER_TITLE,
                        confirmButtonTitle: DELETE_ITEM_CONFIRM_BUTTON_TITLE
                    }
                }}
        />
    );
}

/**
 * 
 *         <Container>
            <Row>
                <Col className='d-flex flex-column'>
                    <Button variant='outline-dark' 
                            className='mt-2'
                            onClick={() => setDeviceVisible(true)}>
                        Добавить устройство
                    </Button>
                    
                    <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
                </Col>
            </Row>
        </Container>
    );
 */

export default DevicePanel;