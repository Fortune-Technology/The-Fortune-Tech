/**
 * Blog Service
 * Business logic for blog CRUD operations
 */

import mongoose from 'mongoose';
import Blog, { IBlogDocument } from '../models/Blog.model';
import { PaginatedResult } from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import {
    generateSlug,
    parseArrayFromString,
    parseJSON,
    calculatePagination,
} from '../utils/helpers';

interface BlogQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
}

export class BlogService {
    /**
     * Get all blogs with pagination and filters
     */
    static async getAll(query: BlogQuery): Promise<PaginatedResult<IBlogDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', status, category, tag, search } = query;

        // Build filter
        const filter: Record<string, unknown> = {};
        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }
        if (tag) {
            filter.tags = { $in: [tag] };
        }
        if (search) {
            filter.$text = { $search: search };
        }

        // Get total count
        const total = await Blog.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        // Get blogs
        const blogs = await Blog.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: blogs,
            pagination: {
                page,
                pageSize: limit,
                total,
                totalPages,
            },
        };
    }

    /**
     * Get published blogs with pagination (public endpoint)
     */
    static async getPublished(query: BlogQuery): Promise<PaginatedResult<IBlogDocument>> {
        return this.getAll({ ...query, status: 'published' });
    }

    /**
     * Get blog by ID or slug
     */
    static async getById(idOrSlug: string): Promise<IBlogDocument> {
        const queryFilter: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            queryFilter.$or.push({ _id: idOrSlug });
        }

        const blog = await Blog.findOne(queryFilter);

        if (!blog) {
            throw new NotFoundError('Blog');
        }

        return blog;
    }

    /**
     * Get related blogs (same category, excluding current)
     */
    static async getRelated(blogId: string, category: string, limit: number = 3): Promise<IBlogDocument[]> {
        return Blog.find({
            _id: { $ne: blogId },
            category,
            status: 'published',
        })
            .sort({ publishedAt: -1 })
            .limit(limit);
    }

    /**
     * Create a new blog post
     */
    static async create(
        data: Record<string, any>,
        featuredImageUrl?: string
    ): Promise<IBlogDocument> {
        const slug = generateSlug(data.title);

        // Check if blog with this slug already exists
        const existing = await Blog.findOne({ slug });
        if (existing) {
            throw new ConflictError('A blog post with this title already exists');
        }

        const blog = new Blog({
            title: data.title,
            slug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: featuredImageUrl,
            category: data.category,
            tags: parseArrayFromString(data.tags as unknown as string),
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            faqSection: parseJSON(data.faqSection, []),
            author: data.author,
            status: data.status || 'draft',
            schemaType: data.schemaType || 'BlogPosting',
        });

        await blog.save();
        return blog;
    }

    /**
     * Update a blog post
     */
    static async update(
        idOrSlug: string,
        data: Record<string, any>,
        featuredImageUrl?: string
    ): Promise<IBlogDocument> {
        const blog = await this.getById(idOrSlug);

        // Prepare update data
        const updateData: Record<string, unknown> = { ...data };

        if (featuredImageUrl) {
            updateData.featuredImage = featuredImageUrl;
        }

        // Parse array fields
        if (data.tags !== undefined) {
            updateData.tags = parseArrayFromString(data.tags as unknown as string);
        }

        // Parse FAQ section (may come as JSON string from form-data)
        if (data.faqSection !== undefined) {
            updateData.faqSection = parseJSON(data.faqSection, blog.faqSection || []);
        }

        // Handle publish transition
        if (data.status === 'published' && blog.status !== 'published') {
            updateData.publishedAt = new Date();
        }

        Object.assign(blog, updateData);
        await blog.save();

        return blog;
    }

    /**
     * Delete a blog post
     */
    static async delete(idOrSlug: string): Promise<void> {
        const blog = await this.getById(idOrSlug);
        await blog.deleteOne();
    }
}
