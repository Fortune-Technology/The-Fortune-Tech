/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, TokenPayload } from '../interfaces';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { Permission, UserRole, ROLE_PERMISSIONS } from '../constants';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions || ROLE_PERMISSIONS[decoded.role] || [],
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('Token has expired'));
        } else if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid token'));
        } else {
            next(error);
        }
    }
};

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuth = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (token) {
            const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                permissions: decoded.permissions || ROLE_PERMISSIONS[decoded.role] || [],
            };
        }

        next();
    } catch {
        // Ignore token errors for optional auth
        next();
    }
};

/**
 * Require specific roles
 */
export const requireRoles = (...roles: UserRole[]) => {
    return (
        req: AuthenticatedRequest,
        _res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new UnauthorizedError('Authentication required'));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(new ForbiddenError('You do not have permission to access this resource'));
            return;
        }

        next();
    };
};

/**
 * Require specific permissions
 */
export const requirePermissions = (...permissions: Permission[]) => {
    return (
        req: AuthenticatedRequest,
        _res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new UnauthorizedError('Authentication required'));
            return;
        }

        const hasPermission = permissions.every((permission) =>
            req.user!.permissions.includes(permission)
        );

        if (!hasPermission) {
            next(new ForbiddenError('You do not have the required permissions'));
            return;
        }

        next();
    };
};

/**
 * Require any of the specified permissions
 */
export const requireAnyPermission = (...permissions: Permission[]) => {
    return (
        req: AuthenticatedRequest,
        _res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new UnauthorizedError('Authentication required'));
            return;
        }

        const hasPermission = permissions.some((permission) =>
            req.user!.permissions.includes(permission)
        );

        if (!hasPermission) {
            next(new ForbiddenError('You do not have the required permissions'));
            return;
        }

        next();
    };
};
