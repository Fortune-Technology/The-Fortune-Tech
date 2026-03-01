/**
 * Auth Controller
 * HTTP handlers for authentication operations
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { AuthService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess, sendCreated } from '../utils/response';
import { COOKIE_OPTIONS } from '../constants';

export class AuthController {
    /**
     * Register new user
     * POST /api/auth/register
     */
    static register = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const user = await AuthService.register(req.body);
        sendCreated(res, user, 'Registration successful. Please verify your email.');
    });

    /**
     * Login user
     * POST /api/auth/login
     */
    static login = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { user, tokens } = await AuthService.login(req.body);

        // Set cookies
        res.cookie('accessToken', tokens.accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        sendSuccess(res, {
            user,
            tokens,
        }, 'Login successful');
    });

    /**
     * Logout user
     * POST /api/auth/logout
     */
    static logout = asyncHandler(async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        // Clear cookies
        res.clearCookie('accessToken', COOKIE_OPTIONS);
        res.clearCookie('refreshToken', COOKIE_OPTIONS);

        sendSuccess(res, null, 'Logout successful');
    });

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    static refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        const tokens = await AuthService.refreshToken(refreshToken);

        // Set new cookies
        res.cookie('accessToken', tokens.accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(res, { tokens }, 'Token refreshed successfully');
    });

    /**
     * Get current user
     * GET /api/auth/me
     */
    static getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            sendSuccess(res, null);
            return;
        }

        const user = await AuthService.getCurrentUser(req.user.id);
        sendSuccess(res, user);
    });

    /**
     * Forgot password
     * POST /api/auth/forgot-password
     */
    static forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await AuthService.forgotPassword(req.body.email);
        sendSuccess(res, null, 'If an account exists with this email, a password reset link has been sent.');
    });

    /**
     * Reset password
     * POST /api/auth/reset-password
     */
    static resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await AuthService.resetPassword(req.body.token, req.body.password);
        sendSuccess(res, null, 'Password reset successful. You can now login with your new password.');
    });

    /**
     * Verify email
     * GET /api/auth/verify-email/:token
     */
    static verifyEmail = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await AuthService.verifyEmail(req.params.token as string);
        sendSuccess(res, null, 'Email verified successfully');
    });
}
