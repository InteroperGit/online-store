import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../utils/context';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components'; 

const StyledListGroupItem = styled(ListGroup.Item)`
    cursor: pointer;
    &:hover {
        background-color: orange;
        color: white;
    }
`;

const TypeBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <ListGroup className='mb-3'>
            { 
                device.types.map(type => 
                    <StyledListGroupItem 
                        className='typeBar-listItem'
                        active={ device.selectedType &&  type.id === device.selectedType.id }
                        onClick={() => device.setSelectedType(type)}
                        key={type.id}>
                        { type.name }
                    </StyledListGroupItem>)
            }
        </ListGroup>
    );
});

export default TypeBar;