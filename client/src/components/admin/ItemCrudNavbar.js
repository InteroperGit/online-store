import React from 'react';
import { Navbar, Nav, Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Тулбар для CRUD-манипуляции данными
 * @param {*} props 
 */
const ItemCrudNavbar = (props) => {
    const { onAddButtonClick, onSearch, searchValue } = props;

    return (
        <Navbar bg="dark" 
                variant="dark" 
                className="mb-2 d-flex justify-content-between w-100">
            <Nav>
                <Button className='typePanel-addButton'
                        variant='outline-light' 
                        onClick={ onAddButtonClick }>
                    <FontAwesomeIcon icon="plus-circle" size="lg" />
                </Button>
            </Nav>
            <Form inline className="ml-3">
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon="search" size="lg" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        className='ml-auto'
                        value={searchValue}
                        placeholder="Фильтр"
                        aria-label="Фильтр"
                        onChange={ onSearch }
                    />
                </InputGroup>
            </Form>
        </Navbar>
    );
};

export default ItemCrudNavbar;