import React from 'react';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../../http/deviceAPI';
import ItemPanel from './ItemPanel';

const CREATE_ITEM_HEADER_TITLE = 'Добавить бренд';
const CREATE_ITEM_CONFIRM_BUTTON_TITLE = 'Добавить';
const UPDATE_ITEM_HEADER_TITLE = 'Изменить бренд';
const UPDATE_ITEM_CONFIRM_BUTTON_TITLE = 'Изменить';
const DELETE_ITEM_HEADER_TITLE = 'Удалить бренд';
const DELETE_ITEM_CONFIRM_BUTTON_TITLE = 'Удалить';

const BrandPanel = () => {
    return (
        <ItemPanel  storeParams={{
                            storeName: 'device',
                            getItem: 'getBrand',
                            itemOrderDirection: 'brandOrderDirection',
                            totalItemsCount: 'totalBrandsCount',
                            setItemOrderDirectionHandler: 'setBrandOrderDirection',
                            setItemsHandler: 'setBrands',
                            setTotalItemsCountHandler: 'setTotalBrandsCount',
                            itemOrderKey: 'name',
                            orderedItems: 'orderedBrands',
                            addItemHandler: 'addBrand',
                            updateItemHandler: 'updateBrand',
                            deleteItemHandler: 'removeBrand',
                            activePage: 'brandActivePage',
                            setActivePageHandler: 'setBrandActivePage'
                    }}
                    apiHandlers={{
                        'get': fetchBrands,
                        'create': createBrand,
                        'update': updateBrand,
                        'delete': deleteBrand
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

export default BrandPanel;