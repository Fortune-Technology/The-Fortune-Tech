/**
 * Careers API Slice
 * CRUD operations for job openings
 */

import { baseApi } from './baseApi';

export interface Career {
    id: string;
    title: string;
    slug?: string;
    department?: string;
    location?: string;
    type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
    experience?: string;
    description: string;
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
    isActive?: boolean;
    featured?: boolean;
    applyLink?: string;
    applicationDeadline?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CareersResponse {
    success: boolean;
    data: Career[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface CareerResponse {
    success: boolean;
    data: Career;
}

interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    type?: string;
    isActive?: boolean;
}

export const careersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCareers: builder.query<CareersResponse, QueryParams | void>({
            query: (params) => ({
                url: '/careers',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Career' as const, id: id })),
                        { type: 'Careers' as const },
                    ]
                    : [{ type: 'Careers' as const }],
        }),

        getCareerById: builder.query<CareerResponse, string>({
            query: (id) => `/careers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Career', id }],
        }),

        createCareer: builder.mutation<CareerResponse, Partial<Career>>({
            query: (data) => ({
                url: '/careers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Careers' }],
        }),

        updateCareer: builder.mutation<CareerResponse, { id: string; data: Partial<Career> }>({
            query: ({ id, data }) => ({
                url: `/careers/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Career', id },
                { type: 'Careers' },
            ],
        }),

        deleteCareer: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/careers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Career', id },
                { type: 'Careers' },
            ],
        }),
    }),
});

export const {
    useGetCareersQuery,
    useGetCareerByIdQuery,
    useCreateCareerMutation,
    useUpdateCareerMutation,
    useDeleteCareerMutation,
} = careersApi;
