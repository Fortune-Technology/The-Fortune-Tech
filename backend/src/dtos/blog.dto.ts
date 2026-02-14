/**
 * Blog DTO
 * Joi validation schemas for blog operations
 */

import Joi from 'joi';

// FAQ item schema (reusable)
const faqItemSchema = Joi.object({
    question: Joi.string().required().trim().messages({
        'string.empty': 'FAQ question is required',
        'any.required': 'FAQ question is required',
    }),
    answer: Joi.string().required().trim().messages({
        'string.empty': 'FAQ answer is required',
        'any.required': 'FAQ answer is required',
    }),
});

export const createBlogSchema = Joi.object({
    title: Joi.string().required().max(300).trim().messages({
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 300 characters',
        'any.required': 'Title is required',
    }),
    excerpt: Joi.string().required().max(500).trim().messages({
        'string.empty': 'Excerpt is required',
        'string.max': 'Excerpt cannot exceed 500 characters',
        'any.required': 'Excerpt is required',
    }),
    content: Joi.string().required().messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
    }),
    category: Joi.string().required().trim().messages({
        'string.empty': 'Category is required',
        'any.required': 'Category is required',
    }),
    tags: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    metaTitle: Joi.string().trim().max(70).allow(''),
    metaDescription: Joi.string().trim().max(160).allow(''),
    faqSection: Joi.alternatives()
        .try(
            Joi.array().items(faqItemSchema),
            Joi.string().allow('') // Accept JSON string from form-data
        )
        .default([]),
    author: Joi.string().required().trim().messages({
        'string.empty': 'Author is required',
        'any.required': 'Author is required',
    }),
    status: Joi.string().valid('draft', 'published').default('draft'),
    schemaType: Joi.string().trim().default('BlogPosting'),
});

export const updateBlogSchema = Joi.object({
    title: Joi.string().max(300).trim(),
    excerpt: Joi.string().max(500).trim(),
    content: Joi.string(),
    category: Joi.string().trim(),
    tags: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    metaTitle: Joi.string().trim().max(70).allow(''),
    metaDescription: Joi.string().trim().max(160).allow(''),
    faqSection: Joi.alternatives()
        .try(
            Joi.array().items(faqItemSchema),
            Joi.string().allow('')
        ),
    author: Joi.string().trim(),
    status: Joi.string().valid('draft', 'published'),
    schemaType: Joi.string().trim(),
}).min(1);

export const blogIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Blog ID is required',
        'any.required': 'Blog ID is required',
    }),
});

export const blogQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'publishedAt', 'title', 'readingTime').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('draft', 'published'),
    category: Joi.string().trim(),
    tag: Joi.string().trim(),
    search: Joi.string().trim().allow(''),
});
