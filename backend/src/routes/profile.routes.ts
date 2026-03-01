/**
 * Profile Routes
 * Authenticated user's own profile management (no admin permissions needed)
 */

import { Router, Response } from 'express';
import { authenticate, validate, singleImage } from '../middlewares';
import { UserService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../interfaces';
import { getFileUrl } from '../config/multer';
import { env } from '../config/env';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile update validation schema (limited fields - no role/status/permissions)
const updateProfileSchema = Joi.object({
    firstName: Joi.string().max(50).trim(),
    lastName: Joi.string().max(50).trim(),
    displayName: Joi.string().max(100).trim().allow(''),
    bio: Joi.string().trim().allow(''),
    phone: Joi.string().trim().allow(''),
    location: Joi.string().trim().allow(''),
    company: Joi.string().trim().allow(''),
    position: Joi.string().trim().allow(''),
}).min(1);

// Change password validation
const profileChangePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'New password must be at least 8 characters',
        'string.empty': 'New password is required',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required',
        }),
});

// Avatar target folder
const AVATAR_FOLDER = 'users/avatars';

/**
 * GET /api/profile
 * Get current user's profile
 */
router.get(
    '/',
    asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            sendSuccess(res, null);
            return;
        }
        const user = await UserService.getById(req.user.id);
        sendSuccess(res, user);
    })
);

/**
 * PUT /api/profile
 * Update current user's profile
 */
router.put(
    '/',
    singleImage('avatar'),
    validate(updateProfileSchema),
    asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            sendSuccess(res, null);
            return;
        }

        let avatarUrl: string | undefined;

        if (req.file) {
            // Multer may save the file to a wrong subfolder (e.g. "profile/" based on route name).
            // We need to move it to the correct "users/avatars/" directory.
            const uploadBase = path.join(process.cwd(), env.UPLOAD_DIR);
            const targetDir = path.join(uploadBase, AVATAR_FOLDER);

            // Ensure target directory exists
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const targetPath = path.join(targetDir, req.file.filename);
            const sourcePath = req.file.path;

            // Move file if it's not already in the correct location
            if (sourcePath !== targetPath) {
                fs.renameSync(sourcePath, targetPath);
            }

            avatarUrl = getFileUrl(req.file.filename, AVATAR_FOLDER);
        }

        const user = await UserService.update(req.user.id, req.body, avatarUrl);
        sendSuccess(res, user, 'Profile updated successfully');
    })
);

/**
 * PATCH /api/profile/password
 * Change current user's password
 */
router.patch(
    '/password',
    validate(profileChangePasswordSchema),
    asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            sendSuccess(res, null);
            return;
        }
        const { currentPassword, newPassword } = req.body;
        await UserService.changePassword(req.user.id, currentPassword, newPassword);
        sendSuccess(res, null, 'Password changed successfully');
    })
);

export default router;
