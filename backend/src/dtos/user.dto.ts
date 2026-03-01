/**
 * User DTO
 * Joi validation schemas for user operations
 */

import Joi from 'joi';
import { USER_ROLES, USER_STATUSES } from '../constants';

export const createUserSchema = Joi.object({
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
    displayName: Joi.string().max(100).trim().allow(''),
    role: Joi.string()
        .valid(...Object.values(USER_ROLES))
        .default(USER_ROLES.CLIENT),
    status: Joi.string()
        .valid(...Object.values(USER_STATUSES))
        .default(USER_STATUSES.PENDING),
    permissions: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    bio: Joi.string().trim().allow(''),
    phone: Joi.string().trim().allow(''),
    location: Joi.string().trim().allow(''),
    department: Joi.string().trim().allow(''),
    position: Joi.string().trim().allow(''),
    company: Joi.string().trim().allow(''),
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().max(50).trim(),
    lastName: Joi.string().max(50).trim(),
    displayName: Joi.string().max(100).trim().allow(''),
    role: Joi.string().valid(...Object.values(USER_ROLES)),
    status: Joi.string().valid(...Object.values(USER_STATUSES)),
    permissions: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    bio: Joi.string().trim().allow(''),
    phone: Joi.string().trim().allow(''),
    location: Joi.string().trim().allow(''),
    department: Joi.string().trim().allow(''),
    position: Joi.string().trim().allow(''),
    company: Joi.string().trim().allow(''),
}).min(1);

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'New password must be at least 8 characters',
        'string.empty': 'New password is required',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required',
        }),
});

export const userIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
    }),
});

export const userQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'firstName', 'lastName', 'email', 'role', 'status').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    role: Joi.string().valid(...Object.values(USER_ROLES)),
    status: Joi.string().valid(...Object.values(USER_STATUSES)),
    search: Joi.string().trim().allow(''),
});
