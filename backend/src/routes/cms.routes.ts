/**
 * CMS Routes
 */

import { Router } from 'express';
import { CMSController } from '../controllers';
import { validate, authenticate, requirePermissions, formDataOnly } from '../middlewares';
import { createCMSPageSchema, updateCMSPageSchema, cmsPageIdSchema, cmsPageQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Public routes
router.get('/published', CMSController.getPublished);
router.get('/page/:slug', CMSController.getBySlug);

// Protected routes
router.get('/', authenticate, validate(cmsPageQuerySchema, 'query'), CMSController.getAll);
router.get('/:id', authenticate, validate(cmsPageIdSchema, 'params'), CMSController.getById);

router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_CMS),
    formDataOnly(),
    validate(createCMSPageSchema),
    CMSController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_CMS),
    formDataOnly(),
    validate(cmsPageIdSchema, 'params'),
    validate(updateCMSPageSchema),
    CMSController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_CMS),
    validate(cmsPageIdSchema, 'params'),
    CMSController.delete
);

router.post(
    '/:id/publish',
    authenticate,
    requirePermissions(PERMISSIONS.PUBLISH_CMS),
    validate(cmsPageIdSchema, 'params'),
    CMSController.publish
);

router.post(
    '/:id/unpublish',
    authenticate,
    requirePermissions(PERMISSIONS.PUBLISH_CMS),
    validate(cmsPageIdSchema, 'params'),
    CMSController.unpublish
);

export default router;
