/**
 * Technology Routes
 * Technology category and item endpoints
 */

import { Router } from 'express';
import { TechnologyController } from '../controllers';
import { validate, authenticate, requirePermissions, singleImage } from '../middlewares';
import {
    createTechnologyCategorySchema,
    updateTechnologyCategorySchema,
    createTechnologyItemSchema,
    updateTechnologyItemSchema,
    technologyCategoryIdSchema,
    technologyItemIdSchema,
} from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Public routes
router.get('/', TechnologyController.getAll);
router.get('/featured', TechnologyController.getFeatured);
router.get('/:id', validate(technologyCategoryIdSchema, 'params'), TechnologyController.getCategoryById);

// Protected routes - Categories
router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_TECHNOLOGIES),
    singleImage('icon'),
    validate(createTechnologyCategorySchema),
    TechnologyController.createCategory
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_TECHNOLOGIES),
    singleImage('icon'),
    validate(technologyCategoryIdSchema, 'params'),
    validate(updateTechnologyCategorySchema),
    TechnologyController.updateCategory
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_TECHNOLOGIES),
    validate(technologyCategoryIdSchema, 'params'),
    TechnologyController.deleteCategory
);

// Protected routes - Items within categories
router.post(
    '/:categoryId/items',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_TECHNOLOGIES),
    singleImage('icon'),
    validate(createTechnologyItemSchema),
    TechnologyController.addItem
);

router.put(
    '/:categoryId/items/:itemId',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_TECHNOLOGIES),
    singleImage('icon'),
    validate(technologyItemIdSchema, 'params'),
    validate(updateTechnologyItemSchema),
    TechnologyController.updateItem
);

router.delete(
    '/:categoryId/items/:itemId',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_TECHNOLOGIES),
    validate(technologyItemIdSchema, 'params'),
    TechnologyController.deleteItem
);

export default router;
