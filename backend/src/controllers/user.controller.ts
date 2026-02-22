/**
 * User Controller
 * HTTP handlers for user management operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { UserService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';
import { getFileUrl, sanitizeFolder } from '../config/multer';

export class UserController {
    static getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await UserService.getAll(req.query);
        sendPaginated(res, result.data, result.pagination);
    });

    static getById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const user = await UserService.getById(req.params.id as string);
        sendSuccess(res, user);
    });

    static create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let avatarUrl: string | undefined;

        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'users/avatars';
            avatarUrl = getFileUrl(req.file.filename, folder);
        }

        const user = await UserService.create(req.body, avatarUrl);
        sendCreated(res, user, 'User created successfully');
    });

    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let avatarUrl: string | undefined;

        if (req.file) {
            const folder = req.body.folder ? sanitizeFolder(req.body.folder as string) : 'users/avatars';
            avatarUrl = getFileUrl(req.file.filename, folder);
        }

        const user = await UserService.update(req.params.id as string, req.body, avatarUrl);
        sendSuccess(res, user, 'User updated successfully');
    });

    static changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { currentPassword, newPassword } = req.body;
        await UserService.changePassword(req.params.id as string, currentPassword, newPassword);
        sendSuccess(res, null, 'Password changed successfully');
    });

    static delete = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await UserService.delete(req.params.id as string);
        sendNoContent(res);
    });
}
