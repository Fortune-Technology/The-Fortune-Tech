/**
 * Career Controller
 * HTTP handlers for career/job posting CRUD operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { CareerService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class CareerController {
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await CareerService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const career = await CareerService.getById(req.params.id as string);
        sendSuccess(res, career);
    });

    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const career = await CareerService.create(req.body);
        sendCreated(res, career, 'Job posting created successfully');
    });

    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const career = await CareerService.update(req.params.id as string, req.body);
        sendSuccess(res, career, 'Job posting updated successfully');
    });

    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await CareerService.delete(req.params.id as string);
        sendNoContent(res);
    });
}
