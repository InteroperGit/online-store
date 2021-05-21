import React, {useContext} from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Card } from 'react-bootstrap';
import { Context } from '../utils/context';
import './BrandBar.css';

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    const onBrandSelected = (brand) => {
        device.setSelectedBrand(brand);
    }

    return (
        <Row className='d-flex justify-content-center'>
            { 
                device.brands.map(brand => 
                    <Card key={brand.id}
                          border={ device.selectedBrand && device.selectedBrand.id === brand.id ? 'danger' : 'grey' }
                          onClick={() => onBrandSelected(brand) }
                          className='p-3 mr-3 mb-3 brand-card'>
                        { brand.name }
                    </Card>
                )
            }
        </Row>
    );
});

export default BrandBar;