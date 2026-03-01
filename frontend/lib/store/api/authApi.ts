/**
 * Auth API Slice
 * Authentication endpoints (login, register, logout, password reset)
 */

import { baseApi } from './baseApi';
import { AuthUser } from '../slices/authSlice';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    token: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    message?: string;
    data: {
        user: AuthUser;
        accessToken: string;
    };
}

interface MessageResponse {
    success: boolean;
    message: string;
}

interface UserResponse {
    success: boolean;
    data: AuthUser;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),

        logout: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),

        refreshToken: builder.mutation<{ data: { accessToken: string } }, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
        }),

        forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),

        resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),

        verifyEmail: builder.query<MessageResponse, string>({
            query: (token) => `/auth/verify-email/${token}`,
        }),

        getCurrentUser: builder.query<UserResponse, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailQuery,
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
} = authApi;
