/**
 * Auth Service
 * Business logic for authentication
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUserDocument } from '../models';
import { LoginDTO, RegisterDTO, TokenPayload, AuthTokens } from '../interfaces';
import { UnauthorizedError, ConflictError, ValidationError, NotFoundError } from '../utils/errors';
import { env } from '../config/env';
import { USER_ROLES, USER_STATUSES } from '../constants';
import { UserService } from './user.service';

export class AuthService {
    /**
     * Register a new user
     */
    static async register(data: RegisterDTO): Promise<IUserDocument> {
        const existing = await User.findOne({ email: data.email.toLowerCase() });
        if (existing) {
            throw new ConflictError('An account with this email already exists');
        }

        const user = new User({
            email: data.email.toLowerCase(),
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: USER_ROLES.CLIENT,
            status: USER_STATUSES.PENDING,
        });

        await user.save();
        return user;
    }

    /**
     * Login user
     */
    static async login(data: LoginDTO): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
        const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check if account is active
        if (user.status === USER_STATUSES.SUSPENDED) {
            throw new UnauthorizedError('Your account has been suspended');
        }

        if (user.status === USER_STATUSES.INACTIVE) {
            throw new UnauthorizedError('Your account is inactive');
        }

        // Verify password
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            await UserService.incrementLoginAttempts(data.email);
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate tokens
        const tokens = AuthService.generateTokens(user);

        // Update last login
        await UserService.updateLastLogin(user._id.toString());

        return { user, tokens };
    }

    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as TokenPayload & { type: string };

            if (decoded.type !== 'refresh') {
                throw new UnauthorizedError('Invalid refresh token');
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                throw new UnauthorizedError('User not found');
            }

            if (user.status !== USER_STATUSES.ACTIVE) {
                throw new UnauthorizedError('Account is not active');
            }

            return AuthService.generateTokens(user);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Refresh token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid refresh token');
            }
            throw error;
        }
    }

    /**
     * Generate access and refresh tokens
     */
    static generateTokens(user: IUserDocument): AuthTokens {
        const payload: TokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            permissions: user.getPermissions(),
        };

        const accessToken = jwt.sign(
            { ...payload, type: 'access' },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
        );

        const refreshToken = jwt.sign(
            { ...payload, type: 'refresh' },
            env.JWT_SECRET,
            { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
        );

        return { accessToken, refreshToken };
    }

    /**
     * Generate password reset token
     */
    static async forgotPassword(email: string): Promise<string> {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists
            throw new NotFoundError('If an account exists with this email, a reset link will be sent');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.metadata.resetPasswordToken = hashedToken;
        user.metadata.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        return resetToken;
    }

    /**
     * Reset password with token
     */
    static async resetPassword(token: string, newPassword: string): Promise<void> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            'metadata.resetPasswordToken': hashedToken,
            'metadata.resetPasswordExpires': { $gt: new Date() },
        });

        if (!user) {
            throw new ValidationError('Invalid or expired reset token');
        }

        user.password = newPassword;
        user.metadata.resetPasswordToken = undefined;
        user.metadata.resetPasswordExpires = undefined;
        await user.save();
    }

    /**
     * Verify email token
     */
    static async verifyEmail(token: string): Promise<void> {
        const user = await User.findOne({ 'metadata.verificationToken': token });

        if (!user) {
            throw new ValidationError('Invalid verification token');
        }

        user.metadata.isVerified = true;
        user.metadata.verificationToken = undefined;
        user.status = USER_STATUSES.ACTIVE;
        await user.save();
    }

    /**
     * Get current user from token
     */
    static async getCurrentUser(userId: string): Promise<IUserDocument> {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }
        return user;
    }
}
