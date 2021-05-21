import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { EMPTY_STRING } from '../../utils/consts';
import { Container, Row, Spinner } from 'react-bootstrap';
import ItemCrudNavbar from './ItemCrudNavbar';
import DataTable from './DataTable';
import PaginationPanel from './PaginationPanel';
import ModifyItemModal from "../modals/ModifyItemModal";
import ModifyDevice from '../modals/ModifyDevice';

const SEARCH_TIMEOUT = process.env.REACT_APP_SEARCH_INPUT_DELAY || 3000;
const ELEMENTS_ON_PAGE = process.env.REACT_APP_ELEMENT_ON_PAGE_COUNT;

const StyledNameHeader = styled.div`
    &:hover {
        cursor: pointer;
        color: blue;
    }
`;

const ItemPanel = observer((props) => {
    const { mode = "default",
            storeParams = {},
            apiHandlers = {}, 
            formConfig = [],
            tableConfig = { 'headers': [], 'data': []},
            modalConfig = {} } = props;
    const { user, device } = useContext(Context);
    const [createItemVisible, setCreateItemVisible] = useState(false);
    const [updateItemVisible, setUpdateItemVisible] = useState(false);
    const [deleteItemVisible, setDeleteItemVisible] = useState(false);
    const [searchValue, setSearchValue] = useState(EMPTY_STRING);
    const [searchTimeout, setSearchTimeout] = useState(undefined);
    const [modifyingItemId, setModifyingItemId] = useState(0);
    const [loading, setLoading] = useState(true);

    const store = storeParams.storeName === 'device' ? device : user;

    const onUpdateItem = (itemId) => {
        const updatingItem = store[storeParams.getItem](itemId);
        if (!updatingItem) {
            return;
        }
        setModifyingItemId(itemId);
        setUpdateItemVisible(true);
    }

    const onDeleteType = (itemId) => {
        const deletingType = store[storeParams.getItem](itemId);
        if (!deletingType) {
            return;
        }
        setModifyingItemId(itemId);
        setDeleteItemVisible(true);
    }

    const onSearch = (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(undefined);
        }

        const currentSearchValue = e.target.value;
        setSearchValue(currentSearchValue);
        
        const sTimeout = setTimeout(() => {
            store[storeParams.setActivePageHandler](1);
            loadData({ filter: currentSearchValue });
            setSearchTimeout(undefined);
        }, SEARCH_TIMEOUT);

        setSearchTimeout(sTimeout);
    }

    const onOrder = () => {
        const orderDirection = store[storeParams.itemOrderDirection] === 'ASC' ? 'DESC' : 'ASC';
        store[storeParams.setItemOrderDirectionHandler](orderDirection);
        loadData({ orderDirection: orderDirection });
    }

    const onPageClick = (e) => {
        const clickedPage = parseInt(e.target.dataset.page);
        store[storeParams.setActivePageHandler](clickedPage);
        loadData({ activePage: clickedPage });
    }

    const loadData = (args) => {
        setLoading(true);

        args = args || {};
        const hasFilter = typeof(args.filter) !== 'undefined';
        const hasOrderDirection = typeof(args.orderDirection) !== 'undefined';
        const hasActivePage = typeof(args.activePage) !== 'undefined';

        const fetchParams = {
            filter: hasFilter ? args.filter : searchValue,
            page: hasActivePage ? args.activePage : store[storeParams.activePage],
            limit: ELEMENTS_ON_PAGE,
            orderKey: store[storeParams.itemOrderKey],
            orderDirection: hasOrderDirection ? args.orderDirection : store[storeParams.itemOrderDirection]
        }

        apiHandlers.get(fetchParams)
            .then(({ count, rows }) => {
                store[storeParams.setItemsHandler](rows);
                store[storeParams.setTotalItemsCountHandler](count);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const getHeaders = () => {
        return tableConfig.headers.map(header => {
            switch(header.type) {
                case 'order':
                    return (
                        <StyledNameHeader className="d-flex align-items-center justify-content-between"
                            onClick={onOrder}>
                                {header.title}
                            <FontAwesomeIcon icon={ store[storeParams.itemOrderDirection] === "ASC" ? "angle-up" : "angle-down" } 
                                             size="lg" />
                        </StyledNameHeader>
                    )
                case 'basic': 
                default: return header.title
            }
        });
    }

    useEffect(() => {
        loadData();
    }, [device[storeParams.totalItemsCount]]);

    if (loading) {
        return <Spinner animation={ "grow" } />
    }

    return (
        <Container className='mt-2'>
            <Row>
                <ItemCrudNavbar onAddButtonClick={ () => setCreateItemVisible(true) }
                                onSearch={ onSearch }
                                searchValue={ searchValue } />
            </Row>
            <Row>
                <DataTable onUpdate={ onUpdateItem }
                           onDelete={ onDeleteType }
                           dataSource={ store[storeParams.orderedItems] }
                           dataKey={ (item) => item.id }
                           dataConfig={
                               {
                                'header': getHeaders(),
                                'data': tableConfig.data
                               }
                           } />
            </Row>
            <Row>
                <PaginationPanel totalItemsCount={store[storeParams.totalItemsCount]}
                                 activePage={store[storeParams.activePage]}
                                 onPage={onPageClick}
                />
            </Row>

            {
                mode && mode === 'default' &&
                    <ModifyItemModal onHide={() => setCreateItemVisible(false)}
                                    show={createItemVisible}
                                    operationType='create'
                                    formConfig={formConfig}
                                    titles={{
                                        headerTitle: modalConfig.create.headerTitle,
                                        confirmButtonTitle: modalConfig.create.confirmButtonTitle
                                    }}
                                    handlers={{
                                        serverModifyItemHandler: apiHandlers.create,
                                        contextModifyItemHandler: store[storeParams.addItemHandler].bind(store)
                                    }} 
                    />
            }

            {
                mode && mode === 'device' &&
                    <ModifyDevice show={createItemVisible} 
                                  hide={() => setCreateItemVisible(false)} 
                    />
            }

            {
                mode && mode === 'default' &&
                    <ModifyItemModal onHide={() => setUpdateItemVisible(false)}
                                        show={updateItemVisible}
                                        operationType='update'
                                        modifyingItemId={modifyingItemId}
                                        formConfig={formConfig}
                                        titles={{
                                            headerTitle: modalConfig.update.headerTitle,
                                            confirmButtonTitle: modalConfig.update.confirmButtonTitle,

                                        }}
                                        handlers={{
                                            serverModifyItemHandler: apiHandlers.update,
                                            contextModifyItemHandler: store[storeParams.updateItemHandler].bind(store),
                                            getItemHandler: store[storeParams.getItem].bind(store)
                                        }} 
                    />
            }

            {
                mode && mode === 'device' &&
                    <ModifyDevice show={updateItemVisible} 
                                  hide={() => setUpdateItemVisible(false)}
                                  selectedDeviceId={modifyingItemId} 
                    />
            }
            
            <ModifyItemModal onHide={() => setDeleteItemVisible(false)}
                                show={deleteItemVisible}
                                operationType='delete'
                                modifyingItemId={modifyingItemId}
                                formConfig={formConfig}
                                titles={{
                                    headerTitle: modalConfig.delete.headerTitle,
                                    confirmButtonTitle: modalConfig.delete.confirmButtonTitle,

                                }}
                                handlers={{
                                    serverModifyItemHandler: apiHandlers.delete,
                                    contextModifyItemHandler: store[storeParams.deleteItemHandler].bind(store),
                                    getItemHandler: store[storeParams.getItem].bind(store)
                                }} 
            />

        </Container>
    );
});

export default ItemPanel;