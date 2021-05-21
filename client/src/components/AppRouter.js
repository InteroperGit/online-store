import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { Context } from '../utils/context';
import { SHOP_ROUTE } from '../utils/consts';

const AppRouter = () => {
    const { user } = useContext(Context);

    return (
        <Switch>
            { user.isAuth && authRoutes.map(({ path, component }) =>
                <Route key={path} path={path} component={component} exact />   
            )}
            { publicRoutes.map(({ path, component }) =>
                <Route key={path} path={path} component={component} exact />   
            )}
            <Redirect to={SHOP_ROUTE} />
        </Switch>
    );
}

export default AppRouter;