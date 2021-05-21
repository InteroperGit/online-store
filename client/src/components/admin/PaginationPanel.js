import React from 'react';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';

const StyledPaginationItem = styled(Pagination.Item)`
    &:hover {
        cursor: pointer;
    }
`;

const ELEMENTS_ON_PAGE = process.env.REACT_APP_ELEMENT_ON_PAGE_COUNT;

/**
 * Таблица данных
 */
const PaginationPanel = (props) => {
    const { totalItemsCount, activePage, onPage } = props;

    const getPaginationItems = () => {
        const pageCount = Math.ceil(totalItemsCount / ELEMENTS_ON_PAGE);
        const array = [...Array(pageCount).keys()].map(i => i + 1);

        return array.map(number => 
                    <StyledPaginationItem key={number} 
                            variant='outline-dark'
                            active={number === activePage}
                            data-page={number}
                            onClick={ onPage }>
                        {number}
                    </StyledPaginationItem>
                );
    }

    return (
        <Pagination className="mb-2 ml-auto mr-auto">
            {getPaginationItems()}
        </Pagination>
    );
}

export default PaginationPanel;