import React from 'react';
import { fetchTypes, createType, updateType, deleteType } from '../../http/deviceAPI';
import ItemPanel from './ItemPanel';

const CREATE_ITEM_HEADER_TITLE = 'Добавить тип';
const UPDATE_ITEM_HEADER_TITLE = 'Изменить тип';
const DELETE_ITEM_HEADER_TITLE = 'Удалить тип';
const CREATE_ITEM_CONFIRM_BUTTON_TITLE = 'Добавить';
const UPDATE_ITEM_CONFIRM_BUTTON_TITLE = 'Изменить';
const DELETE_ITEM_CONFIRM_BUTTON_TITLE = 'Удалить';

const TypePanel = () => {
    return (
        <ItemPanel storeParams={{
                    storeName: 'device',
                    getItem: 'getType',
                    itemOrderDirection: 'typeOrderDirection',
                    totalItemsCount: 'totalTypesCount',
                    setItemOrderDirectionHandler: 'setTypeOrderDirection',
                    setItemsHandler: 'setTypes',
                    setTotalItemsCountHandler: 'setTotalTypesCount',
                    itemOrderKey: 'name',
                    orderedItems: 'orderedTypes',
                    addItemHandler: 'addType',
                    updateItemHandler: 'updateType',
                    deleteItemHandler: 'removeType',
                    activePage: 'typeActivePage',
                    setActivePageHandler: 'setTypeActivePage'
                }}
                apiHandlers={{
                    'get': fetchTypes,
                    'create': createType,
                    'update': updateType,
                    'delete': deleteType
                }}
                formConfig={[
                    {
                        field: 'name',
                        type: 'text',
                        label: 'Наименование',
                        control: {
                            placeholder: 'Введите название типа'
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
                        (type) => type.serialNumber,
                        (type) => type.name
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
};

export default TypePanel;