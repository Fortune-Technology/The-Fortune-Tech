/**
 * Validation Middleware
 * Joi schema validation for request data
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendValidationError } from '../utils/response';

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidationOptions {
    stripUnknown?: boolean;
    abortEarly?: boolean;
}

/**
 * Create a validation middleware for the given Joi schema
 */
export const validate = (
    schema: Joi.ObjectSchema,
    target: ValidationTarget = 'body',
    options: ValidationOptions = {}
) => {
    const { stripUnknown = true, abortEarly = false } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
        const dataToValidate = req[target];

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly,
            stripUnknown,
            errors: {
                wrap: {
                    label: '',
                },
            },
        });

        if (error) {
            const details: Record<string, string[]> = {};

            error.details.forEach((detail) => {
                const key = detail.path.join('.') || 'general';
                if (!details[key]) {
                    details[key] = [];
                }
                details[key].push(detail.message);
            });

            sendValidationError(res, details);
            return;
        }

        // Replace the target data with validated (and potentially stripped) data
        // In Express 5, some properties like 'query' may be read-only (getter only)
        // so we use Object.defineProperty to shadow them
        Object.defineProperty(req, target, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
        next();
    };
};

/**
 * Validate multiple targets at once
 */
export const validateMultiple = (
    schemas: Partial<Record<ValidationTarget, Joi.ObjectSchema>>,
    options: ValidationOptions = {}
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { stripUnknown = true, abortEarly = false } = options;
        const allDetails: Record<string, string[]> = {};
        let hasError = false;

        (Object.keys(schemas) as ValidationTarget[]).forEach((target) => {
            const schema = schemas[target];
            if (!schema) return;

            const { error, value } = schema.validate(req[target], {
                abortEarly,
                stripUnknown,
                errors: {
                    wrap: {
                        label: '',
                    },
                },
            });

            if (error) {
                hasError = true;
                error.details.forEach((detail) => {
                    const key = `${target}.${detail.path.join('.')}` || target;
                    if (!allDetails[key]) {
                        allDetails[key] = [];
                    }
                    allDetails[key].push(detail.message);
                });
            } else {
                // Replace the target data with validated (and potentially stripped) data
                // In Express 5, some properties like 'query' may be read-only (getter only)
                // so we use Object.defineProperty to shadow them
                Object.defineProperty(req, target, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            }
        });

        if (hasError) {
            sendValidationError(res, allDetails);
            return;
        }

        next();
    };
};
