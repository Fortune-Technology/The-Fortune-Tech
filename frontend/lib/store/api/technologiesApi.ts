/**
 * Technologies API Slice
 * CRUD operations for technology categories and items
 */

import { baseApi } from './baseApi';

export interface TechnologyItem {
    _id: string;
    name: string;
    icon?: string;
    description?: string;
    proficiency?: number;
    expertiseLevel?: string;
    useCases?: string[];
    featured?: boolean;
    order?: number;
}

export interface TechnologyCategory {
    _id: string;
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    items: TechnologyItem[];
    featured?: boolean;
    isActive?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface TechnologiesResponse {
    success: boolean;
    data: TechnologyCategory[];
}

interface TechnologyResponse {
    success: boolean;
    data: TechnologyCategory;
}

interface CreateCategoryData {
    name: string;
    description?: string;
    icon?: string;
    featured?: boolean;
    isActive?: boolean;
    order?: number;
}

interface CreateItemData {
    name: string;
    icon?: string;
    description?: string;
    proficiency?: number;
    order?: number;
}

export const technologiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTechnologies: builder.query<TechnologiesResponse, void>({
            query: () => '/technologies',
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Technology' as const, id: _id })),
                        { type: 'Technologies' as const },
                    ]
                    : [{ type: 'Technologies' as const }],
        }),

        getFeaturedTechnologies: builder.query<TechnologiesResponse, void>({
            query: () => '/technologies/featured',
            providesTags: [{ type: 'Technologies', id: 'FEATURED' }],
        }),

        getTechnologyById: builder.query<TechnologyResponse, string>({
            query: (id) => `/technologies/${id}`,
            providesTags: (result, error, id) => [{ type: 'Technology', id }],
        }),

        // Category CRUD
        createTechnologyCategory: builder.mutation<TechnologyResponse, FormData>({
            query: (data) => ({
                url: '/technologies',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Technologies' }],
        }),

        updateTechnologyCategory: builder.mutation<TechnologyResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/technologies/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Technology', id },
                { type: 'Technologies' },
            ],
        }),

        deleteTechnologyCategory: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/technologies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Technology', id },
                { type: 'Technologies' },
            ],
        }),

        // Item CRUD within categories
        addTechnologyItem: builder.mutation<TechnologyResponse, { categoryId: string; data: FormData }>({
            query: ({ categoryId, data }) => ({
                url: `/technologies/${categoryId}/items`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { categoryId }) => [
                { type: 'Technology', id: categoryId },
                { type: 'Technologies' },
            ],
        }),

        updateTechnologyItem: builder.mutation<TechnologyResponse, { categoryId: string; itemId: string; data: FormData }>({
            query: ({ categoryId, itemId, data }) => ({
                url: `/technologies/${categoryId}/items/${itemId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { categoryId }) => [
                { type: 'Technology', id: categoryId },
                { type: 'Technologies' },
            ],
        }),

        deleteTechnologyItem: builder.mutation<{ success: boolean; message: string }, { categoryId: string; itemId: string }>({
            query: ({ categoryId, itemId }) => ({
                url: `/technologies/${categoryId}/items/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { categoryId }) => [
                { type: 'Technology', id: categoryId },
                { type: 'Technologies' },
            ],
        }),
    }),
});

export const {
    useGetTechnologiesQuery,
    useGetFeaturedTechnologiesQuery,
    useGetTechnologyByIdQuery,
    useCreateTechnologyCategoryMutation,
    useUpdateTechnologyCategoryMutation,
    useDeleteTechnologyCategoryMutation,
    useAddTechnologyItemMutation,
    useUpdateTechnologyItemMutation,
    useDeleteTechnologyItemMutation,
} = technologiesApi;
