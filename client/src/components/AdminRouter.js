import React from 'react';
import { Switch, Route } from 'react-router-dom'
import TypePanel from './admin/TypePanel';
import BrandPanel from './admin/BrandPanel';
import DevicePanel from './admin/DevicePanel';
import UserPanel from './admin/UserPanel';
import { ADMIN_ROUTE, ADMIN_TYPE_ROUTE, ADMIN_BRAND_ROUTE, 
         ADMIN_DEVICE_ROUTE, ADMIN_USER_ROUTE } from '../utils/consts';

const AdminRouter = () => {
    return (
        <Switch>
            <Route exact path={ADMIN_ROUTE} component={TypePanel}/>
            <Route path={ADMIN_TYPE_ROUTE} component={TypePanel}/>
            <Route path={ADMIN_BRAND_ROUTE} component={BrandPanel}/>
            <Route path={ADMIN_DEVICE_ROUTE} component={DevicePanel}/>
            <Route path={ADMIN_USER_ROUTE} component={UserPanel}/>
        </Switch>
    );
}

export default AdminRouter;