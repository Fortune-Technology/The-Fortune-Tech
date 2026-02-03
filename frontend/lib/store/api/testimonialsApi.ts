/**
 * Testimonials API Slice
 * CRUD operations for testimonials
 */

import { baseApi } from './baseApi';

export interface Testimonial {
    id: string;
    _id?: string; // Keep for backwards compatibility
    slug?: string;
    name: string;
    role?: string;
    company?: string;
    industry?: string;
    serviceProvided?: string;
    projectType?: string;
    avatar?: string;
    thumbnail?: string;
    content: string;
    rating?: number;
    metrics?: Record<string, string>;
    linkedin?: string;
    website?: string;
    verified?: boolean;
    featured?: boolean;
    isActive?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface TestimonialsResponse {
    success: boolean;
    data: Testimonial[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface TestimonialResponse {
    success: boolean;
    data: Testimonial;
}

interface QueryParams {
    page?: number;
    limit?: number;
    featured?: boolean;
    isActive?: boolean;
}

export const testimonialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTestimonials: builder.query<TestimonialsResponse, QueryParams | void>({
            query: (params) => ({
                url: '/testimonials',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id, _id }) => ({ type: 'Testimonial' as const, id: id || _id })),
                        { type: 'Testimonials' as const },
                    ]
                    : [{ type: 'Testimonials' as const }],
        }),

        getFeaturedTestimonials: builder.query<TestimonialsResponse, void>({
            query: () => '/testimonials/featured',
            providesTags: [{ type: 'Testimonials', id: 'FEATURED' }],
        }),

        getTestimonialById: builder.query<TestimonialResponse, string>({
            query: (id) => `/testimonials/${id}`,
            providesTags: (result, error, id) => [{ type: 'Testimonial', id }],
        }),

        createTestimonial: builder.mutation<TestimonialResponse, FormData>({
            query: (data) => ({
                url: '/testimonials',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Testimonials' }],
        }),

        updateTestimonial: builder.mutation<TestimonialResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/testimonials/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Testimonial', id },
                { type: 'Testimonials' },
            ],
        }),

        deleteTestimonial: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/testimonials/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Testimonial', id },
                { type: 'Testimonials' },
            ],
        }),
    }),
});

export const {
    useGetTestimonialsQuery,
    useGetFeaturedTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} = testimonialsApi;
