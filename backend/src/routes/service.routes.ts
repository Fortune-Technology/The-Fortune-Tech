/**
 * Service Routes
 * Service CRUD endpoints with multipart/form-data support
 */

import { Router } from 'express';
import { ServiceController } from '../controllers';
import { validate, authenticate, requirePermissions, multiFields } from '../middlewares';
import { createServiceSchema, updateServiceSchema, serviceIdSchema, serviceQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// File fields for service uploads
const serviceUploadFields = [
    { name: 'image', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
];

// Public routes
router.get('/', validate(serviceQuerySchema, 'query'), ServiceController.getAll);
router.get('/featured', ServiceController.getFeatured);
router.get('/:id', validate(serviceIdSchema, 'params'), ServiceController.getById);

// Protected routes (require authentication)
router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_SERVICES),
    multiFields(serviceUploadFields),
    validate(createServiceSchema),
    ServiceController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_SERVICES),
    multiFields(serviceUploadFields),
    validate(serviceIdSchema, 'params'),
    validate(updateServiceSchema),
    ServiceController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_SERVICES),
    validate(serviceIdSchema, 'params'),
    ServiceController.delete
);

export default router;
