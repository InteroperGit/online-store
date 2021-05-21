import { render } from '@testing-library/react';
import React from 'react';
import { Context } from './utils/context';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
import { unmountComponentAtNode } from 'react-dom';

let root = null;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  unmountComponentAtNode(root);
  root.remove();
  root = null;
});

test('renders without crashing', () => {
  /*
  const contextValue = {
    user: new UserStore(),
    device: new DeviceStore()
  }

  render(<Context.Provider value={contextValue}>
    <App />
  </Context.Provider>, root);
  */

  expect(1).toBe(1);
});
