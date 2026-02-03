/**
 * Services API Slice
 * CRUD operations for services
 */

import { baseApi } from './baseApi';

export interface Service {
    id: string;
    _id?: string; // Keep for backwards compatibility
    title: string;
    slug?: string;
    tagline?: string;
    description: string;
    overview?: string;
    icon?: string;
    image?: string;
    thumbnail?: string;
    features?: string[];
    deliverables?: string[];
    process?: string[];
    techStack?: string[];
    benefits?: string[];
    idealFor?: string[];
    cta?: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
    pricingHint?: string;
    featured?: boolean;
    isActive?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface ServicesResponse {
    success: boolean;
    data: Service[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface ServiceResponse {
    success: boolean;
    data: Service;
}

interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    featured?: boolean;
    isActive?: boolean;
}

export const servicesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<ServicesResponse, QueryParams | void>({
            query: (params) => ({
                url: '/services',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id, _id }) => ({ type: 'Service' as const, id: id || _id })),
                        { type: 'Services' as const },
                    ]
                    : [{ type: 'Services' as const }],
        }),

        getFeaturedServices: builder.query<ServicesResponse, void>({
            query: () => '/services/featured',
            providesTags: [{ type: 'Services', id: 'FEATURED' }],
        }),

        getServiceById: builder.query<ServiceResponse, string>({
            query: (id) => `/services/${id}`,
            providesTags: (result, error, id) => [{ type: 'Service', id }],
        }),

        createService: builder.mutation<ServiceResponse, FormData>({
            query: (data) => ({
                url: '/services',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Services' }],
        }),

        updateService: builder.mutation<ServiceResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/services/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Service', id },
                { type: 'Services' },
            ],
        }),

        deleteService: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Service', id },
                { type: 'Services' },
            ],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetFeaturedServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;
