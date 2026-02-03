/**
 * Notification Slice
 * Manages toast notifications for success/error/info messages
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number; // Auto-dismiss duration in ms
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (
            state,
            action: PayloadAction<Omit<Notification, 'id'>>
        ) => {
            const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            state.notifications.push({
                ...action.payload,
                id,
                duration: action.payload.duration ?? 5000, // Default 5 seconds
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { addNotification, removeNotification, clearNotifications } =
    notificationSlice.actions;
export default notificationSlice.reducer;

// Selectors
export const selectNotifications = (state: { notification: NotificationState }) =>
    state.notification.notifications;

// Helper action creators for common notification types
export const showSuccessNotification = (message: string, title?: string) =>
    addNotification({ type: 'success', message, title });

export const showErrorNotification = (message: string, title?: string) =>
    addNotification({ type: 'error', message, title });

export const showWarningNotification = (message: string, title?: string) =>
    addNotification({ type: 'warning', message, title });

export const showInfoNotification = (message: string, title?: string) =>
    addNotification({ type: 'info', message, title });
