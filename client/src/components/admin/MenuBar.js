import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

const StyledListGroupItem = styled(ListGroup.Item)`
    &:hover {
        color: white;
        background-color: orange;
        cursor: pointer;
    }
`;

const MenuBar = observer((props) => {
    const { menu, selectedItem } = props;

    const history = useHistory();

    return (
        <ListGroup className='mt-2 mb-3'>
            { 
                menu && menu.map(m => 
                    <StyledListGroupItem
                        active={ selectedItem && m.id === selectedItem }
                        onClick={() => history.push(m.route) }
                        key={m.id}>
                        { m.name }
                    </StyledListGroupItem>)
            }
        </ListGroup>
    );
});

export default MenuBar;