/**
 * Response Utility
 * Standardized API response helpers
 */

import { Response } from 'express';
import { ApiResponse, ApiError } from '../interfaces';
import { HTTP_STATUS } from '../constants';

/**
 * Send a success response
 */
export const sendSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
): Response => {
    return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Send a paginated success response
 */
export const sendPaginated = <T>(
    res: Response,
    data: T[],
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    },
    message?: string
): Response => {
    const response: ApiResponse<T[]> = {
        success: true,
        data,
        message,
        pagination,
    };
    return res.status(HTTP_STATUS.OK).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
    res: Response,
    error: ApiError,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): Response => {
    const response: ApiResponse = {
        success: false,
        error,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send a validation error response
 */
export const sendValidationError = (
    res: Response,
    details: Record<string, string[]>
): Response => {
    return sendError(
        res,
        {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details,
        },
        HTTP_STATUS.BAD_REQUEST
    );
};

/**
 * Send a not found error response
 */
export const sendNotFound = (
    res: Response,
    resource: string = 'Resource'
): Response => {
    return sendError(
        res,
        {
            code: 'NOT_FOUND',
            message: `${resource} not found`,
        },
        HTTP_STATUS.NOT_FOUND
    );
};

/**
 * Send an unauthorized error response
 */
export const sendUnauthorized = (
    res: Response,
    message: string = 'Unauthorized'
): Response => {
    return sendError(
        res,
        {
            code: 'UNAUTHORIZED',
            message,
        },
        HTTP_STATUS.UNAUTHORIZED
    );
};

/**
 * Send a forbidden error response
 */
export const sendForbidden = (
    res: Response,
    message: string = 'Access denied'
): Response => {
    return sendError(
        res,
        {
            code: 'FORBIDDEN',
            message,
        },
        HTTP_STATUS.FORBIDDEN
    );
};

/**
 * Send a conflict error response
 */
export const sendConflict = (
    res: Response,
    message: string = 'Resource already exists'
): Response => {
    return sendError(
        res,
        {
            code: 'CONFLICT',
            message,
        },
        HTTP_STATUS.CONFLICT
    );
};

/**
 * Send a no content response (204)
 */
export const sendNoContent = (res: Response): Response => {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
};
