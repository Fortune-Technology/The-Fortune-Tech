/**
 * Portfolio API Slice
 * CRUD operations for portfolio items
 */

import { baseApi } from './baseApi';

export interface Portfolio {
    _id: string;
    title: string;
    slug?: string;
    description: string;
    category?: string;
    thumbnail?: string;
    images?: string[];
    technologies?: string[];
    techStack?: Record<string, string[]>;
    client?: string;
    projectUrl?: string;
    githubUrl?: string;
    duration?: string;
    year?: number;
    status?: string;
    industry?: string;
    featured?: boolean;
    isActive?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PortfoliosResponse {
    success: boolean;
    data: Portfolio[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface PortfolioResponse {
    success: boolean;
    data: Portfolio;
}

interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
    isActive?: boolean;
}

export const portfolioApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPortfolios: builder.query<PortfoliosResponse, QueryParams | void>({
            query: (params) => ({
                url: '/portfolio',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Portfolio' as const, id: _id })),
                        { type: 'Portfolios' as const },
                    ]
                    : [{ type: 'Portfolios' as const }],
        }),

        getFeaturedPortfolios: builder.query<PortfoliosResponse, void>({
            query: () => '/portfolio/featured',
            providesTags: [{ type: 'Portfolios', id: 'FEATURED' }],
        }),

        getPortfolioById: builder.query<PortfolioResponse, string>({
            query: (id) => `/portfolio/${id}`,
            providesTags: (result, error, id) => [{ type: 'Portfolio', id }],
        }),

        createPortfolio: builder.mutation<PortfolioResponse, FormData>({
            query: (data) => ({
                url: '/portfolio',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Portfolios' }],
        }),

        updatePortfolio: builder.mutation<PortfolioResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/portfolio/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Portfolio', id },
                { type: 'Portfolios' },
            ],
        }),

        deletePortfolio: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/portfolio/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Portfolio', id },
                { type: 'Portfolios' },
            ],
        }),
    }),
});

export const {
    useGetPortfoliosQuery,
    useGetFeaturedPortfoliosQuery,
    useGetPortfolioByIdQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} = portfolioApi;
