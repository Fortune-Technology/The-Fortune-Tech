'use client';

/**
 * Store Provider
 * Client component wrapper to provide Redux store to the application
 */

import { Provider } from 'react-redux';
import { store } from './store';

interface StoreProviderProps {
    children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}
