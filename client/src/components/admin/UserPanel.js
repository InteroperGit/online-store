import React from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../http/userAPI';
import ItemPanel from './ItemPanel';

const CREATE_ITEM_HEADER_TITLE = 'Добавить пользователя';
const UPDATE_ITEM_HEADER_TITLE = 'Изменить пользователя';
const DELETE_ITEM_HEADER_TITLE = 'Удалить пользователя';
const CREATE_ITEM_CONFIRM_BUTTON_TITLE = 'Добавить';
const UPDATE_ITEM_CONFIRM_BUTTON_TITLE = 'Изменить';
const DELETE_ITEM_CONFIRM_BUTTON_TITLE = 'Удалить';

const TypePanel = () => {
    return (
        <ItemPanel storeParams={{
                    storeName: 'user',
                    getItem: 'getUser',
                    itemOrderDirection: 'userOrderDirection',
                    totalItemsCount: 'totalUsersCount',
                    setItemOrderDirectionHandler: 'setUserOrderDirection',
                    setItemsHandler: 'setUsers',
                    setTotalItemsCountHandler: 'setTotalUsersCount',
                    itemOrderKey: 'fullName',
                    orderedItems: 'orderedUsers',
                    addItemHandler: 'addUser',
                    updateItemHandler: 'updateUser',
                    deleteItemHandler: 'removeUser',
                    activePage: 'activePage',
                    setActivePageHandler: 'setActivePage'
            }}
            apiHandlers={{
                'get': fetchUsers,
                'create': createUser,
                'update': updateUser,
                'delete': deleteUser
            }}
            formConfig={[
                {
                    field: 'fullName',
                    type: 'text',
                    label: 'ФИО',
                    control: {
                        placeholder: 'Введите ФИО'
                    }
                },
                {
                    field: 'nickName',
                    type: 'text',
                    label: 'Ник',
                    control: {
                        placeholder: 'Введите имя пользователя'
                    }
                },
                {
                    field: 'email',
                    type: 'email',
                    readOnly: {
                        'update': true
                    },
                    label: 'Email',
                    control: {
                        placeholder: 'Введите email'
                    }
                },
                {
                    field: 'password',
                    type: 'password',
                    label: 'Пароль',
                    control: {
                        placeholder: 'Введите пароль'
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
                            title: 'ФИО'
                        }
                    ],
                    "data": [
                        (user) => user.serialNumber,
                        (user) => user.fullName
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

export default TypePanel;