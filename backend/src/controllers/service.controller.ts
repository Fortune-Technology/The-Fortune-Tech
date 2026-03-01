/**
 * Service Controller
 * HTTP handlers for service CRUD operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { ServiceService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';
import { getFileUrl, sanitizeFolder } from '../config/multer';

export class ServiceController {
    /**
     * Get all services
     * GET /api/services
     */
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await ServiceService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    /**
     * Get service by ID
     * GET /api/services/:id
     */
    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const service = await ServiceService.getById(req.params.id as string);
        sendSuccess(res, service);
    });

    /**
     * Get featured services
     * GET /api/services/featured
     */
    static getFeatured = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const limit = parseInt(req.query.limit as string) || 6;
        const services = await ServiceService.getFeatured(limit);
        sendSuccess(res, services);
    });

    /**
     * Create a new service
     * POST /api/services (multipart/form-data)
     */
    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let imageUrl: string | undefined;
        let thumbnailUrl: string | undefined;

        // Handle file uploads - can be single file or multiple files
        if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['image'] && files['image'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
                imageUrl = getFileUrl(files['image'][0].filename, folder);
            }
            if (files['thumbnail'] && files['thumbnail'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
                thumbnailUrl = getFileUrl(files['thumbnail'][0].filename, folder);
            }
        } else if (req.file) {
            // Single file upload (backward compatibility)
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
            imageUrl = getFileUrl(req.file.filename, folder);
        }

        const service = await ServiceService.create(req.body, imageUrl, thumbnailUrl);
        sendCreated(res, service, 'Service created successfully');
    });

    /**
     * Update a service
     * PUT /api/services/:id (multipart/form-data)
     */
    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let imageUrl: string | undefined;
        let thumbnailUrl: string | undefined;

        // Handle file uploads - can be single file or multiple files
        if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['image'] && files['image'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
                imageUrl = getFileUrl(files['image'][0].filename, folder);
            }
            if (files['thumbnail'] && files['thumbnail'][0]) {
                const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
                thumbnailUrl = getFileUrl(files['thumbnail'][0].filename, folder);
            }
        } else if (req.file) {
            // Single file upload (backward compatibility)
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'services';
            imageUrl = getFileUrl(req.file.filename, folder);
        }

        const service = await ServiceService.update(req.params.id as string, req.body, imageUrl, thumbnailUrl);
        sendSuccess(res, service, 'Service updated successfully');
    });

    /**
     * Delete a service
     * DELETE /api/services/:id
     */
    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await ServiceService.delete(req.params.id as string);
        sendNoContent(res);
    });
}
