import { render, screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import React from 'react';
import NavBar from './NavBar';
import { Context } from '../utils/context';
import UserStore from '../store/UserStore';
import DeviceStore from '../store/DeviceStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { unmountComponentAtNode } from 'react-dom';
import mockAxios from 'axios';

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const timeoutRender = async (timeOut, fn, ...args) => {
    const component = fn(...args);
    await timeout(timeOut);
    return component;
}

const contextValue = {
    user: new UserStore(),
    device: new DeviceStore()
}

let root = null;

beforeAll(() => {
    library.add(fas);
});

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
    render(<Context.Provider value={contextValue}>
        <NavBar />
   </Context.Provider>, root);
    const navbar = document.getElementById('header-navbar');
    expect(navbar).toBeDefined();
});

test('has authorization button', () => {
    render(<Context.Provider value={contextValue}>
        <NavBar />
   </Context.Provider>, root);
    const button = screen.getByText(/авторизация/i);
    expect(button).toBeDefined();
});

describe('after authorization', () => {
    beforeAll(() => {
        const { user } = contextValue;
        user.setIsAuth(true);
    });

    it('4 basket devices', async () => {
        const { user, device } = contextValue;
    
        await act(async () => {
            const component =   (<Context.Provider value={contextValue}>
                                    <NavBar />
                                </Context.Provider>);
    
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: { amount: 4 } }));
    
            await timeoutRender(2000, render, component, root);
        });
    
        expect(mockAxios.get).toHaveBeenCalledTimes(1)
        expect(user.isAuth).toBeTruthy();
        expect(device.totalBasketDevicesCount).toBe(4);
    });

    it('has three buttons', () => {
        act(() => {
            render(<Context.Provider value={contextValue}>
                <NavBar />
            </Context.Provider>, root);
        });

        const basketButton = screen.getByTestId(/basketbutton/i);
        const adminButton = screen.getByTestId(/adminbutton/i);
        const logoutButton = screen.getByTestId(/logoutbutton/i);

        expect(basketButton).toBeDefined();
        expect(adminButton).toBeDefined();
        expect(logoutButton).toBeDefined();
    });
});

