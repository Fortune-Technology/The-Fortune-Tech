/**
 * Auth Slice
 * Manages authentication state (user, tokens, auth status)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    role: string;
    avatar?: string;
    permissions?: string[];
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading to check auth on app load
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user?: AuthUser; accessToken: string }>
        ) => {
            const { user, accessToken } = action.payload;
            if (user) {
                state.user = user;
            }
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        setUser: (state, action: PayloadAction<AuthUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setCredentials, setUser, logOut, setLoading } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
