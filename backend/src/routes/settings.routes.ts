/**
 * Settings Routes
 */

import { Router } from 'express';
import { SettingsController } from '../controllers';
import { validate, authenticate, requirePermissions, multiFields } from '../middlewares';
import { updateSettingsSchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Public route - get settings (for frontend)
router.get('/', SettingsController.get);

// Protected routes
router.put(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_SETTINGS),
    multiFields([
        { name: 'logo', maxCount: 1 },
        { name: 'favicon', maxCount: 1 }
    ]),
    (req, _res, next) => {
        if (req.body.data) {
            try {
                // Parse the nested data object
                const parsedData = JSON.parse(req.body.data);
                // Merge it into req.body
                req.body = { ...req.body, ...parsedData };
                // Clean up the stringified data field
                delete req.body.data;
            } catch (e) {
                // If parsing fails, validation will likely catch it or it's not JSON
            }
        }
        next();
    },
    validate(updateSettingsSchema),
    SettingsController.update
);

export default router;
