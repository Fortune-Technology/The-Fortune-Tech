/**
 * Blogs API Slice
 * CRUD operations for blog posts
 */

import { baseApi } from './baseApi';

export interface BlogFAQItem {
    question: string;
    answer: string;
}

export interface Blog {
    id: string;
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
    faqSection: BlogFAQItem[];
    author: string;
    status: 'draft' | 'published';
    publishedAt?: string;
    readingTime: number;
    schemaType: string;
    createdAt?: string;
    updatedAt?: string;
}

interface BlogsResponse {
    success: boolean;
    data: Blog[];
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

interface BlogResponse {
    success: boolean;
    data: Blog;
}

interface BlogQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    category?: string;
    tag?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export const blogsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin: Get all blogs (including drafts)
        getBlogs: builder.query<BlogsResponse, BlogQueryParams | void>({
            query: (params) => ({
                url: '/blogs',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id, _id }) => ({ type: 'Blog' as const, id: id || _id })),
                        { type: 'Blogs' as const },
                    ]
                    : [{ type: 'Blogs' as const }],
        }),

        // Public: Get published blogs only
        getPublishedBlogs: builder.query<BlogsResponse, BlogQueryParams | void>({
            query: (params) => ({
                url: '/blogs/published',
                params: params || {},
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id, _id }) => ({ type: 'Blog' as const, id: id || _id })),
                        { type: 'Blogs' as const, id: 'PUBLISHED' },
                    ]
                    : [{ type: 'Blogs' as const, id: 'PUBLISHED' }],
        }),

        // Get single blog by ID or slug
        getBlogById: builder.query<BlogResponse, string>({
            query: (id) => `/blogs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Blog', id }],
        }),

        // Get related blogs
        getRelatedBlogs: builder.query<{ success: boolean; data: Blog[] }, string>({
            query: (id) => `/blogs/${id}/related`,
            providesTags: [{ type: 'Blogs', id: 'RELATED' }],
        }),

        // Create blog
        createBlog: builder.mutation<BlogResponse, FormData>({
            query: (data) => ({
                url: '/blogs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Blogs' }],
        }),

        // Update blog
        updateBlog: builder.mutation<BlogResponse, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/blogs/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Blog', id },
                { type: 'Blogs' },
            ],
        }),

        // Delete blog
        deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Blog', id },
                { type: 'Blogs' },
            ],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetPublishedBlogsQuery,
    useGetBlogByIdQuery,
    useGetRelatedBlogsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogsApi;
