/**
 * Profile API Slice
 * Authenticated user's own profile and password management
 */

import { baseApi } from './baseApi';
import { AuthUser } from '../slices/authSlice';

interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    phone?: string;
    location?: string;
    company?: string;
    position?: string;
}

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ProfileResponse {
    success: boolean;
    message?: string;
    data: AuthUser & {
        profile?: {
            bio?: string;
            phone?: string;
            location?: string;
            company?: string;
            position?: string;
            department?: string;
        };
    };
}

interface MessageResponse {
    success: boolean;
    message: string;
}

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileResponse, void>({
            query: () => '/profile',
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<ProfileResponse, FormData>({
            query: (data) => ({
                url: '/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        changeProfilePassword: builder.mutation<MessageResponse, ChangePasswordData>({
            query: (data) => ({
                url: '/profile/password',
                method: 'PATCH',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangeProfilePasswordMutation,
} = profileApi;
