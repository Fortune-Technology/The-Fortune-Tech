/**
 * Portfolio DTO
 * Joi validation schemas for portfolio operations
 */

import Joi from 'joi';
import { PORTFOLIO_STATUSES } from '../constants';

export const createPortfolioSchema = Joi.object({
    title: Joi.string().required().max(200).trim().messages({
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    category: Joi.string().required().trim().messages({
        'string.empty': 'Category is required',
        'any.required': 'Category is required',
    }),
    industry: Joi.string().trim().allow(''),
    clientName: Joi.string().trim().allow(''),
    clientLocation: Joi.string().trim().allow(''),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    longDescription: Joi.string().trim().allow(''),
    keyFeatures: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    techStack: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())), Joi.string().allow(''))
        .default({}),
    metrics: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.string()), Joi.string().allow(''))
        .default({}),
    timeline: Joi.string().trim().allow(''),
    status: Joi.string()
        .valid(...Object.values(PORTFOLIO_STATUSES))
        .default(PORTFOLIO_STATUSES.COMPLETED),
    servicesProvided: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    liveLink: Joi.string().uri().trim().allow(''),
    caseStudyLink: Joi.string().uri().trim().allow(''),
    githubLink: Joi.string().uri().trim().allow(''),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
        .default(false),
    technologyStack: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
});

export const updatePortfolioSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    category: Joi.string().trim(),
    industry: Joi.string().trim().allow(''),
    clientName: Joi.string().trim().allow(''),
    clientLocation: Joi.string().trim().allow(''),
    description: Joi.string().trim(),
    longDescription: Joi.string().trim().allow(''),
    keyFeatures: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    techStack: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())), Joi.string().allow('')),
    metrics: Joi.alternatives()
        .try(Joi.object().pattern(Joi.string(), Joi.string()), Joi.string().allow('')),
    timeline: Joi.string().trim().allow(''),
    status: Joi.string().valid(...Object.values(PORTFOLIO_STATUSES)),
    servicesProvided: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    liveLink: Joi.string().uri().trim().allow(''),
    caseStudyLink: Joi.string().uri().trim().allow(''),
    githubLink: Joi.string().uri().trim().allow(''),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
    technologyStack: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
}).min(1);

export const portfolioIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Portfolio ID is required',
        'any.required': 'Portfolio ID is required',
    }),
});

export const portfolioQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'title', 'featured').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    featured: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')),
    category: Joi.string().trim().allow(''),
    status: Joi.string().valid(...Object.values(PORTFOLIO_STATUSES)),
    search: Joi.string().trim().allow(''),
});
