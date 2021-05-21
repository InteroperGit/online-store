import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table } from 'react-bootstrap';
import './DeviceInfoTable.css';

const DeviceInfoTable = observer((props) => {
    const { info = [] } = props;

    return (
        <div>
            <h2>Характеристики:</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        info.map((info) => 
                            <tr key={ info.id } 
                                className='descriptionTable-row'>
                                <td>
                                    { info.title }
                                </td>
                                <td>
                                    { info.description }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    );
});

export default DeviceInfoTable;