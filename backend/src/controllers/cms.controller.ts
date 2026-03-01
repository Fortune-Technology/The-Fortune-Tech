/**
 * CMS Controller
 * HTTP handlers for CMS page CRUD operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { CMSService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class CMSController {
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await CMSService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.getById(req.params.id as string);
        sendSuccess(res, page);
    });

    static getBySlug = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.getBySlug(req.params.slug as string);
        sendSuccess(res, page);
    });

    static getPublished = asyncHandler(async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        const pages = await CMSService.getPublished();
        sendSuccess(res, pages);
    });

    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.create(req.body);
        sendCreated(res, page, 'CMS page created successfully');
    });

    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.update(req.params.id as string, req.body);
        sendSuccess(res, page, 'CMS page updated successfully');
    });

    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await CMSService.delete(req.params.id as string);
        sendNoContent(res);
    });

    static publish = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.publish(req.params.id as string);
        sendSuccess(res, page, 'CMS page published successfully');
    });

    static unpublish = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const page = await CMSService.unpublish(req.params.id as string);
        sendSuccess(res, page, 'CMS page unpublished successfully');
    });
}
