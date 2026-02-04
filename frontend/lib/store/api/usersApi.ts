/**
 * Users API Slice
 * CRUD operations for user management
 */

import { baseApi } from './baseApi';
import { User } from '../../../types';
export type { User };

interface UsersResponse {
    success: boolean;
    data: User[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface UserResponse {
    success: boolean;
    data: User;
}

interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

interface ChangePasswordData {
    currentPassword?: string;
    newPassword: string;
}

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UsersResponse, QueryParams | void>({
            query: (params) => ({
                url: '/users',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'Users' as const },
                    ]
                    : [{ type: 'Users' as const }],
        }),

        getUserById: builder.query<UserResponse, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        createUser: builder.mutation<UserResponse, FormData>({
            query: (data) => ({
                url: '/users',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Users' }],
        }),

        updateUser: builder.mutation<UserResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                { type: 'Users' },
            ],
        }),

        changePassword: builder.mutation<{ success: boolean; message: string }, { id: string; data: ChangePasswordData }>({
            query: ({ id, data }) => ({
                url: `/users/${id}/password`,
                method: 'PATCH',
                body: data,
            }),
        }),

        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id },
                { type: 'Users' },
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useDeleteUserMutation,
} = usersApi;
