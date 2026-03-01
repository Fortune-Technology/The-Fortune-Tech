/**
 * Career DTO
 * Joi validation schemas for career operations
 */

import Joi from 'joi';
import { JOB_TYPES } from '../constants';

export const createCareerSchema = Joi.object({
    title: Joi.string().required().max(200).trim().messages({
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    department: Joi.string().required().trim().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required',
    }),
    location: Joi.string().required().trim().messages({
        'string.empty': 'Location is required',
        'any.required': 'Location is required',
    }),
    experience: Joi.string().trim().allow(''),
    type: Joi.string()
        .valid(...Object.values(JOB_TYPES))
        .default(JOB_TYPES.FULL_TIME),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    requirements: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    benefits: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    applyLink: Joi.string().uri().trim().allow(''),
});

export const updateCareerSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    department: Joi.string().trim(),
    location: Joi.string().trim(),
    experience: Joi.string().trim().allow(''),
    type: Joi.string().valid(...Object.values(JOB_TYPES)),
    description: Joi.string().trim(),
    requirements: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    benefits: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    applyLink: Joi.string().uri().trim().allow(''),
}).min(1);

export const careerIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Career ID is required',
        'any.required': 'Career ID is required',
    }),
});

export const careerQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'title', 'department').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    department: Joi.string().trim().allow(''),
    type: Joi.string().valid(...Object.values(JOB_TYPES)),
    search: Joi.string().trim().allow(''),
});
