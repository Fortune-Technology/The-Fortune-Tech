/**
 * Service DTO
 * Joi validation schemas for service operations
 */

import Joi from 'joi';

export const createServiceSchema = Joi.object({
    title: Joi.string().required().max(200).trim().messages({
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    tagline: Joi.string().max(300).trim().allow(''),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    overview: Joi.string().trim().allow(''),
    icon: Joi.string().trim().allow(''),
    features: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    deliverables: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    process: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    techStack: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    benefits: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    idealFor: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    cta: Joi.string().trim().allow(''),
    metaTitle: Joi.string().trim().allow(''),
    metaDescription: Joi.string().trim().allow(''),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
        .default(false),
});

export const updateServiceSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    tagline: Joi.string().max(300).trim().allow(''),
    description: Joi.string().trim(),
    overview: Joi.string().trim().allow(''),
    icon: Joi.string().trim().allow(''),
    features: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    deliverables: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    process: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    techStack: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    benefits: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    idealFor: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    cta: Joi.string().trim().allow(''),
    metaTitle: Joi.string().trim().allow(''),
    metaDescription: Joi.string().trim().allow(''),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
}).min(1);

export const serviceIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Service ID is required',
        'any.required': 'Service ID is required',
    }),
});

export const serviceQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'title', 'featured').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    featured: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')),
    search: Joi.string().trim().allow(''),
});
