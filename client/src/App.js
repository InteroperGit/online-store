import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useContext, useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Context } from './utils/context';
import { BrowserRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { check } from './http/userAPI';

library.add(fas);

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check()
    .then((data) => {
      user.setUser(data);
      user.setIsAuth(true);
    })
    .finally(() => setLoading(false));
  }, []);

  return loading 
    ? <Spinner animation={ "grow" } />
    : (
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    );
});

export default App;
