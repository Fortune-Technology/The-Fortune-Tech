/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { HTTP_STATUS, ERROR_CODES } from '../constants';
import { isDevelopment } from '../config/env';
import { MulterError } from 'multer';

/**
 * Handle 404 Not Found errors
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const error = new AppError(
        `Cannot ${req.method} ${req.originalUrl}`,
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND
    );
    next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    // Log error in development
    if (isDevelopment) {
        console.error('❌ Error:', err);
    }

    // Handle Multer errors (file upload)
    if (err instanceof MulterError) {
        const message = getMulterErrorMessage(err);
        return sendError(
            res,
            { code: ERROR_CODES.FILE_UPLOAD_ERROR, message },
            HTTP_STATUS.BAD_REQUEST
        );
    }

    // Handle custom AppError
    if (err instanceof AppError) {
        return sendError(
            res,
            {
                code: err.code,
                message: err.message,
                details: err.details,
            },
            err.statusCode
        );
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const mongooseError = err as unknown as { errors: Record<string, { message: string }> };
        const details: Record<string, string[]> = {};

        Object.keys(mongooseError.errors).forEach((key) => {
            details[key] = [mongooseError.errors[key].message];
        });

        return sendError(
            res,
            {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: 'Validation failed',
                details,
            },
            HTTP_STATUS.BAD_REQUEST
        );
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return sendError(
            res,
            {
                code: ERROR_CODES.INVALID_INPUT,
                message: 'Invalid ID format',
            },
            HTTP_STATUS.BAD_REQUEST
        );
    }

    // Handle Mongoose duplicate key error
    if ((err as { code?: number }).code === 11000) {
        const match = err.message.match(/index: (\w+)_/);
        const field = match ? match[1] : 'field';
        return sendError(
            res,
            {
                code: ERROR_CODES.ALREADY_EXISTS,
                message: `${field} already exists`,
            },
            HTTP_STATUS.CONFLICT
        );
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(
            res,
            {
                code: ERROR_CODES.TOKEN_INVALID,
                message: 'Invalid token',
            },
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(
            res,
            {
                code: ERROR_CODES.TOKEN_EXPIRED,
                message: 'Token has expired',
            },
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    // Handle SyntaxError (JSON parsing)
    if (err instanceof SyntaxError && 'body' in err) {
        return sendError(
            res,
            {
                code: ERROR_CODES.INVALID_INPUT,
                message: 'Invalid JSON in request body',
            },
            HTTP_STATUS.BAD_REQUEST
        );
    }

    // Default to 500 Internal Server Error
    return sendError(
        res,
        {
            code: ERROR_CODES.INTERNAL_ERROR,
            message: isDevelopment ? err.message : 'Internal server error',
        },
        HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
};

/**
 * Get user-friendly Multer error message
 */
const getMulterErrorMessage = (err: MulterError): string => {
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            return 'File size exceeds the maximum limit';
        case 'LIMIT_FILE_COUNT':
            return 'Too many files uploaded';
        case 'LIMIT_FIELD_KEY':
            return 'Field name is too long';
        case 'LIMIT_FIELD_VALUE':
            return 'Field value is too long';
        case 'LIMIT_FIELD_COUNT':
            return 'Too many fields in the form';
        case 'LIMIT_UNEXPECTED_FILE':
            return `Unexpected file field: ${err.field}`;
        default:
            return 'File upload error';
    }
};
