/**
 * Blog Controller
 * HTTP handlers for blog CRUD operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { BlogService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';
import { getFileUrl, sanitizeFolder } from '../config/multer';

export class BlogController {
    /**
     * Get all blogs (admin — includes drafts)
     * GET /api/blogs
     */
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await BlogService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    /**
     * Get published blogs (public)
     * GET /api/blogs/published
     */
    static getPublished = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await BlogService.getPublished(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    /**
     * Get blog by ID or slug
     * GET /api/blogs/:id
     */
    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const blog = await BlogService.getById(req.params.id as string);
        sendSuccess(res, blog);
    });

    /**
     * Get related blogs
     * GET /api/blogs/:id/related
     */
    static getRelated = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const blog = await BlogService.getById(req.params.id as string);
        const related = await BlogService.getRelated(blog._id.toString(), blog.category);
        sendSuccess(res, related);
    });

    /**
     * Create a new blog post
     * POST /api/blogs (multipart/form-data)
     */
    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let featuredImageUrl: string | undefined;

        // Handle file upload
        if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['featuredImage'] && files['featuredImage'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'blogs';
                featuredImageUrl = getFileUrl(files['featuredImage'][0].filename, folder);
            }
        } else if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'blogs';
            featuredImageUrl = getFileUrl(req.file.filename, folder);
        }

        const blog = await BlogService.create(req.body, featuredImageUrl);
        sendCreated(res, blog, 'Blog post created successfully');
    });

    /**
     * Update a blog post
     * PUT /api/blogs/:id (multipart/form-data)
     */
    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let featuredImageUrl: string | undefined;

        // Handle file upload
        if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['featuredImage'] && files['featuredImage'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'blogs';
                featuredImageUrl = getFileUrl(files['featuredImage'][0].filename, folder);
            }
        } else if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'blogs';
            featuredImageUrl = getFileUrl(req.file.filename, folder);
        }

        const blog = await BlogService.update(req.params.id as string, req.body, featuredImageUrl);
        sendSuccess(res, blog, 'Blog post updated successfully');
    });

    /**
     * Delete a blog post
     * DELETE /api/blogs/:id
     */
    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await BlogService.delete(req.params.id as string);
        sendNoContent(res);
    });
}