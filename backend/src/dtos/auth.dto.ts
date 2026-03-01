/**
 * Auth DTO
 * Joi validation schemas for authentication operations
 */

import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    rememberMe: Joi.boolean().default(false),
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required',
        }),
    firstName: Joi.string().required().max(50).trim().messages({
        'string.empty': 'First name is required',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().max(50).trim().messages({
        'string.empty': 'Last name is required',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required',
    }),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Reset token is required',
        'any.required': 'Reset token is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required',
        }),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required',
    }),
});
