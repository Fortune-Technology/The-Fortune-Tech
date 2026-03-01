/**
 * Custom Error Classes
 * Application-specific error types for better error handling
 */

import { HTTP_STATUS, ERROR_CODES } from '../constants';

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    public readonly details?: Record<string, string[]>;

    constructor(
        message: string,
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code: string = ERROR_CODES.INTERNAL_ERROR,
        details?: Record<string, string[]>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        this.details = details;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details?: Record<string, string[]>) {
        super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.ALREADY_EXISTS);
    }
}

export class TokenExpiredError extends AppError {
    constructor(message: string = 'Token has expired') {
        super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED);
    }
}

export class TokenInvalidError extends AppError {
    constructor(message: string = 'Invalid token') {
        super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_INVALID);
    }
}

export class FileUploadError extends AppError {
    constructor(message: string = 'File upload failed') {
        super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.FILE_UPLOAD_ERROR);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string = 'Database operation failed') {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.DATABASE_ERROR);
    }
}
