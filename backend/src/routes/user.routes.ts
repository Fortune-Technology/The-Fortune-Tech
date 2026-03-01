/**
 * User Routes
 */

import { Router } from 'express';
import { UserController } from '../controllers';
import { validate, authenticate, requirePermissions, singleImage } from '../middlewares';
import { createUserSchema, updateUserSchema, changePasswordSchema, userIdSchema, userQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get(
    '/',
    requirePermissions(PERMISSIONS.VIEW_USERS),
    validate(userQuerySchema, 'query'),
    UserController.getAll
);

router.get(
    '/:id',
    requirePermissions(PERMISSIONS.VIEW_USERS),
    validate(userIdSchema, 'params'),
    UserController.getById
);

router.post(
    '/',
    requirePermissions(PERMISSIONS.CREATE_USERS),
    singleImage('avatar'),
    validate(createUserSchema),
    UserController.create
);

router.put(
    '/:id',
    requirePermissions(PERMISSIONS.EDIT_USERS),
    singleImage('avatar'),
    validate(userIdSchema, 'params'),
    validate(updateUserSchema),
    UserController.update
);

router.patch(
    '/:id/password',
    requirePermissions(PERMISSIONS.EDIT_USERS),
    validate(userIdSchema, 'params'),
    validate(changePasswordSchema),
    UserController.changePassword
);

router.delete(
    '/:id',
    requirePermissions(PERMISSIONS.DELETE_USERS),
    validate(userIdSchema, 'params'),
    UserController.delete
);

export default router;
