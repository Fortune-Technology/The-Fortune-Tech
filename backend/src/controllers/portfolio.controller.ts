/**
 * Portfolio Controller
 * HTTP handlers for portfolio CRUD operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { PortfolioService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';
import { getFileUrl, sanitizeFolder } from '../config/multer';

export class PortfolioController {
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await PortfolioService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const portfolio = await PortfolioService.getById(req.params.id as string);
        sendSuccess(res, portfolio);
    });

    static getFeatured = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const limit = parseInt(req.query.limit as string) || 6;
        const portfolios = await PortfolioService.getFeatured(limit);
        sendSuccess(res, portfolios);
    });

    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let thumbnailUrl: string | undefined;

        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'portfolio';
            thumbnailUrl = getFileUrl(req.file.filename, folder);
        }

        const portfolio = await PortfolioService.create(req.body, thumbnailUrl);
        sendCreated(res, portfolio, 'Portfolio item created successfully');
    });

    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let thumbnailUrl: string | undefined;

        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'portfolio';
            thumbnailUrl = getFileUrl(req.file.filename, folder);
        }

        const portfolio = await PortfolioService.update(req.params.id as string, req.body, thumbnailUrl);
        sendSuccess(res, portfolio, 'Portfolio item updated successfully');
    });

    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await PortfolioService.delete(req.params.id as string);
        sendNoContent(res);
    });
}
