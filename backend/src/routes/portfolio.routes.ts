/**
 * Portfolio Routes
 * Portfolio CRUD endpoints with multipart/form-data support
 */

import { Router } from 'express';
import { PortfolioController } from '../controllers';
import { validate, authenticate, requirePermissions, singleImage } from '../middlewares';
import { createPortfolioSchema, updatePortfolioSchema, portfolioIdSchema, portfolioQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Public routes
router.get('/', validate(portfolioQuerySchema, 'query'), PortfolioController.getAll);
router.get('/featured', PortfolioController.getFeatured);
router.get('/:id', validate(portfolioIdSchema, 'params'), PortfolioController.getById);

// Protected routes
router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_PORTFOLIO),
    singleImage('thumbnail'),
    validate(createPortfolioSchema),
    PortfolioController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_PORTFOLIO),
    singleImage('thumbnail'),
    validate(portfolioIdSchema, 'params'),
    validate(updatePortfolioSchema),
    PortfolioController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_PORTFOLIO),
    validate(portfolioIdSchema, 'params'),
    PortfolioController.delete
);

export default router;
