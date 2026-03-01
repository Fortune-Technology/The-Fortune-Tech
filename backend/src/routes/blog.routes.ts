/**
 * Blog Routes
 * Blog CRUD endpoints with multipart/form-data support
 */

import { Router } from 'express';
import { BlogController } from '../controllers';
import { validate, authenticate, requirePermissions, multiFields } from '../middlewares';
import { createBlogSchema, updateBlogSchema, blogIdSchema, blogQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// File fields for blog uploads
const blogUploadFields = [
    { name: 'featuredImage', maxCount: 1 },
];

// Public routes
router.get('/published', validate(blogQuerySchema, 'query'), BlogController.getPublished);
router.get('/:id', validate(blogIdSchema, 'params'), BlogController.getById);
router.get('/:id/related', validate(blogIdSchema, 'params'), BlogController.getRelated);

// Protected routes (require authentication)
router.get(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.VIEW_BLOGS),
    validate(blogQuerySchema, 'query'),
    BlogController.getAll
);

router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_BLOGS),
    multiFields(blogUploadFields),
    validate(createBlogSchema),
    BlogController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_BLOGS),
    multiFields(blogUploadFields),
    validate(blogIdSchema, 'params'),
    validate(updateBlogSchema),
    BlogController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_BLOGS),
    validate(blogIdSchema, 'params'),
    BlogController.delete
);

export default router;
