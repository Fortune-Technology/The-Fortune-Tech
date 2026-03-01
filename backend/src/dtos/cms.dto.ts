/**
 * CMS DTO
 * Joi validation schemas for CMS page operations
 */

import Joi from 'joi';
import { CMS_STATUSES } from '../constants';

export const createCMSPageSchema = Joi.object({
    title: Joi.string().required().max(200).trim().messages({
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    slug: Joi.string().trim().allow(''),
    status: Joi.string()
        .valid(...Object.values(CMS_STATUSES))
        .default(CMS_STATUSES.DRAFT),
    metaTitle: Joi.string().trim().allow(''),
    metaDescription: Joi.string().trim().allow(''),
    content: Joi.string().required().messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
    }),
});

export const updateCMSPageSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    slug: Joi.string().trim(),
    status: Joi.string().valid(...Object.values(CMS_STATUSES)),
    metaTitle: Joi.string().trim().allow(''),
    metaDescription: Joi.string().trim().allow(''),
    content: Joi.string(),
}).min(1);

export const cmsPageIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Page ID is required',
        'any.required': 'Page ID is required',
    }),
});

export const cmsPageQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'title', 'status').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid(...Object.values(CMS_STATUSES)),
    search: Joi.string().trim().allow(''),
});
