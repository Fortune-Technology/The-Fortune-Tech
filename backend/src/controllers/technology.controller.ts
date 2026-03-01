/**
 * Technology Controller
 * HTTP handlers for technology category and item operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { TechnologyService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { getFileUrl, sanitizeFolder } from '../config/multer';

export class TechnologyController {
    static getAll = asyncHandler(async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        const categories = await TechnologyService.getAll();
        sendSuccess(res, categories);
    });

    static getCategoryById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const category = await TechnologyService.getCategoryById(req.params.id as string);
        sendSuccess(res, category);
    });

    static getFeatured = asyncHandler(async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        const items = await TechnologyService.getFeatured();
        sendSuccess(res, items);
    });

    static createCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'technology';
            req.body.icon = getFileUrl(req.file.filename, folder);
        }
        const category = await TechnologyService.createCategory(req.body);
        sendCreated(res, category, 'Technology category created successfully');
    });

    static updateCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'technology';
            req.body.icon = getFileUrl(req.file.filename, folder);
        }
        const category = await TechnologyService.updateCategory(req.params.id as string, req.body);
        sendSuccess(res, category, 'Technology category updated successfully');
    });

    static deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await TechnologyService.deleteCategory(req.params.id as string);
        sendNoContent(res);
    });

    static addItem = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'technology';
            req.body.icon = getFileUrl(req.file.filename, folder);
        }
        const category = await TechnologyService.addItem(req.params.categoryId as string, req.body);
        sendCreated(res, category, 'Technology item added successfully');
    });

    static updateItem = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'technology';
            req.body.icon = getFileUrl(req.file.filename, folder);
        }
        const category = await TechnologyService.updateItem(
            req.params.categoryId as string,
            req.params.itemId as string,
            req.body
        );
        sendSuccess(res, category, 'Technology item updated successfully');
    });

    static deleteItem = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const category = await TechnologyService.deleteItem(req.params.categoryId as string, req.params.itemId as string);
        sendSuccess(res, category, 'Technology item deleted successfully');
    });
}
