/**
 * Career Routes
 */

import { Router } from 'express';
import { CareerController } from '../controllers';
import { validate, authenticate, requirePermissions, formDataOnly } from '../middlewares';
import { createCareerSchema, updateCareerSchema, careerIdSchema, careerQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Public routes
router.get('/', validate(careerQuerySchema, 'query'), CareerController.getAll);
router.get('/:id', validate(careerIdSchema, 'params'), CareerController.getById);

// Protected routes
router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_CAREERS),
    formDataOnly(),
    validate(createCareerSchema),
    CareerController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_CAREERS),
    formDataOnly(),
    validate(careerIdSchema, 'params'),
    validate(updateCareerSchema),
    CareerController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_CAREERS),
    validate(careerIdSchema, 'params'),
    CareerController.delete
);

export default router;
