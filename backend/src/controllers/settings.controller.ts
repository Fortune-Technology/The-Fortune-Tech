/**
 * Settings Controller
 * HTTP handlers for website configuration operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { SettingsService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';

export class SettingsController {
    /**
     * Get website configuration
     * GET /api/settings
     */
    static get = asyncHandler(async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        const config = await SettingsService.get();
        sendSuccess(res, config);
    });

    /**
     * Update website configuration
     * PUT /api/settings (multipart/form-data)
     */
    static update = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let updateData = req.body;

        // Handle JSON stringified data implementation for multipart/form-data
        if (req.body.data) {
            try {
                updateData = JSON.parse(req.body.data);
            } catch (e) {
                // Ignore parse error, use body as is
            }
        }

        // Handle file uploads
        if (req.files) {
            const files = req.files as { [key: string]: Express.Multer.File[] };

            if (files.logo?.[0]) {
                const folder = req.body.folder || 'images';
                if (!updateData.logo) updateData.logo = `/uploads/${folder}/${files.logo[0].filename}`;
                // Also update nested site object if present, for consistency
                if (updateData.site) updateData.site.logo = `/uploads/${folder}/${files.logo[0].filename}`;
            }

            if (files.favicon?.[0]) {
                const folder = req.body.folder || 'images';
                if (!updateData.favicon) updateData.favicon = `/uploads/${folder}/${files.favicon[0].filename}`;
                // Also update nested site object if present
                if (updateData.site) updateData.site.favicon = `/uploads/${folder}/${files.favicon[0].filename}`;
            }
        }

        const config = await SettingsService.update(updateData);
        sendSuccess(res, config, 'Settings updated successfully');
    });
}
