'use client';

/**
 * Store Provider
 * Client component wrapper to provide Redux store to the application
 */

import { Provider } from 'react-redux';
import { store } from './store';
import AuthPersist from '../../components/auth/AuthPersist';

interface StoreProviderProps {
    children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
    return (
        <Provider store={store}>
            <AuthPersist />
            {children}
        </Provider>
    );
}
