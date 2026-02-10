/**
 * CMS API Slice
 * CRUD operations for CMS pages with publish/unpublish
 */

import { baseApi } from './baseApi';

export interface CMSPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    type?: 'page' | 'blog' | 'case-study' | 'documentation';
    status: 'draft' | 'published' | 'archived';
    featured?: boolean;
    author?: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        ogImage?: string;
    };
    tags?: string[];
    categories?: string[];
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CMSPagesResponse {
    success: boolean;
    data: CMSPage[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface CMSPageResponse {
    success: boolean;
    data: CMSPage;
}

interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
}

export const cmsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCMSPages: builder.query<CMSPagesResponse, QueryParams | void>({
            query: (params) => ({
                url: '/cms',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'CMS' as const, id: id })),
                        { type: 'CMSPages' as const },
                    ]
                    : [{ type: 'CMSPages' as const }],
        }),

        getPublishedPages: builder.query<CMSPagesResponse, void>({
            query: () => '/cms/published',
            providesTags: [{ type: 'CMSPages', id: 'PUBLISHED' }],
        }),

        getCMSPageById: builder.query<CMSPageResponse, string>({
            query: (id) => `/cms/${id}`,
            providesTags: (result, error, id) => [{ type: 'CMS', id }],
        }),

        getCMSPageBySlug: builder.query<CMSPageResponse, string>({
            query: (slug) => `/cms/page/${slug}`,
            providesTags: (result) =>
                result?.data ? [{ type: 'CMS', id: result.data.id }] : [],
        }),

        createCMSPage: builder.mutation<CMSPageResponse, Partial<CMSPage>>({
            query: (data) => ({
                url: '/cms',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'CMSPages' }],
        }),

        updateCMSPage: builder.mutation<CMSPageResponse, { id: string; data: Partial<CMSPage> }>({
            query: ({ id, data }) => ({
                url: `/cms/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'CMS', id },
                { type: 'CMSPages' },
            ],
        }),

        deleteCMSPage: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/cms/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'CMS', id },
                { type: 'CMSPages' },
            ],
        }),

        publishCMSPage: builder.mutation<CMSPageResponse, string>({
            query: (id) => ({
                url: `/cms/${id}/publish`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'CMS', id },
                { type: 'CMSPages' },
                { type: 'CMSPages', id: 'PUBLISHED' },
            ],
        }),

        unpublishCMSPage: builder.mutation<CMSPageResponse, string>({
            query: (id) => ({
                url: `/cms/${id}/unpublish`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'CMS', id },
                { type: 'CMSPages' },
                { type: 'CMSPages', id: 'PUBLISHED' },
            ],
        }),
    }),
});

export const {
    useGetCMSPagesQuery,
    useGetPublishedPagesQuery,
    useGetCMSPageByIdQuery,
    useGetCMSPageBySlugQuery,
    useCreateCMSPageMutation,
    useUpdateCMSPageMutation,
    useDeleteCMSPageMutation,
    usePublishCMSPageMutation,
    useUnpublishCMSPageMutation,
} = cmsApi;
