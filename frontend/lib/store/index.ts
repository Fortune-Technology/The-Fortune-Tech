/**
 * Store barrel export
 */

export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { StoreProvider } from './StoreProvider';
export { useAppDispatch, useAppSelector } from './hooks';

// Auth exports
export {
    setCredentials,
    setUser,
    logOut,
    setLoading,
    selectCurrentUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAccessToken,
} from './slices/authSlice';
export type { AuthUser } from './slices/authSlice';

// Notification exports
export {
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    selectNotifications,
} from './slices/notificationSlice';
export type { Notification, NotificationType } from './slices/notificationSlice';
