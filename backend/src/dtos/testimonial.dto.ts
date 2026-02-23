/**
 * Testimonial DTO
 * Joi validation schemas for testimonial operations
 */

import Joi from 'joi';

export const createTestimonialSchema = Joi.object({
    name: Joi.string().required().max(100).trim().messages({
        'string.empty': 'Name is required',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required',
    }),
    role: Joi.string().trim().allow(''),
    company: Joi.string().trim().allow(''),
    industry: Joi.string().trim().allow(''),
    serviceProvided: Joi.string().trim().allow(''),
    projectType: Joi.string().trim().allow(''),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required',
    }),
    content: Joi.string().required().trim().messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
    }),
    metrics: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.string()), Joi.string().allow(''))
        .default({}),
    linkedin: Joi.string().uri().trim().allow(''),
    website: Joi.string().uri().trim().allow(''),
    verified: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
        .default(true),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
        .default(false),
    portfolios: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
});

export const updateTestimonialSchema = Joi.object({
    name: Joi.string().max(100).trim(),
    role: Joi.string().trim().allow(''),
    company: Joi.string().trim().allow(''),
    industry: Joi.string().trim().allow(''),
    serviceProvided: Joi.string().trim().allow(''),
    projectType: Joi.string().trim().allow(''),
    rating: Joi.number().integer().min(1).max(5),
    content: Joi.string().trim(),
    metrics: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.string()), Joi.string().allow('')),
    linkedin: Joi.string().uri().trim().allow(''),
    website: Joi.string().uri().trim().allow(''),
    verified: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
    portfolios: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
}).min(1);

export const testimonialIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Testimonial ID is required',
        'any.required': 'Testimonial ID is required',
    }),
});

export const testimonialQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'name', 'rating', 'featured').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    featured: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')),
    verified: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')),
    search: Joi.string().trim().allow(''),
});
