/**
 * Auth Routes
 * Authentication endpoints
 */

import { Router } from 'express';
import { AuthController } from '../controllers';
import { validate } from '../middlewares';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../dtos';
import { authenticate } from '../middlewares';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.get('/verify-email/:token', AuthController.verifyEmail);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
