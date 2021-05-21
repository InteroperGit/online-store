import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DataTable.css';

/**
 * Таблица данных
 */
const DataTable = (props) => {
    const { onUpdate, onDelete, dataSource, dataKey, dataConfig } = props;

    const getTableRows = () => {
        return dataSource && dataSource.map(type => 
            <tr key={dataKey(type)}>
                {
                    dataConfig.data && dataConfig.data.map((itemConfig, index) => 
                        <td key={`${type.id}-${index}`} 
                            className='dataTable-td'>{ itemConfig(type) }</td>
                    )
                }
                <td>
                    <div className='d-flex justify-content-center'>
                        <Button data-id={type.id} 
                                variant='outline-info' 
                                size='sm'
                                onClick={ (e) => onUpdate(parseInt(e.currentTarget.dataset.id)) }>
                                    <FontAwesomeIcon icon="edit" size="lg" />
                        </Button>
                        <Button data-id={type.id} 
                                variant='outline-danger' 
                                size='sm' 
                                className='ml-2'
                                onClick={ (e) => onDelete(parseInt(e.currentTarget.dataset.id)) }>
                                    <FontAwesomeIcon icon="times-circle" size="lg" />
                        </Button>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <Table striped bordered hover>
        <thead>
            <tr>
                {
                    dataConfig.header && dataConfig.header.map((item, index) => 
                         <th key={index}>{item}</th>
                    )
                }
                <th>Операции</th>
            </tr>
        </thead>
        <tbody>
            {
                getTableRows()
            }
        </tbody>
    </Table>
    );
}

export default DataTable;