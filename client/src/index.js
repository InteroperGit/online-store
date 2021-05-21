import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Context } from './utils/context';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';

dotenv.config();

const contextValue = {
  user: new UserStore(),
  device: new DeviceStore()
}

ReactDOM.render(
  <Context.Provider value={contextValue}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);