/**
 * Technology DTO
 * Joi validation schemas for technology operations
 */

import Joi from 'joi';

export const createTechnologyCategorySchema = Joi.object({
    category: Joi.string().required().trim().messages({
        'string.empty': 'Category name is required',
        'any.required': 'Category name is required',
    }),
    description: Joi.string().trim().allow(''),
    items: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required().trim().messages({
                    'string.empty': 'Technology name is required',
                    'any.required': 'Technology name is required',
                }),
                icon: Joi.string().trim().allow(''),

                useCases: Joi.alternatives()
                    .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
                    .default([]),
                featured: Joi.alternatives()
                    .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
                    .default(false),
            })
        )
        .default([]),
});

export const updateTechnologyCategorySchema = Joi.object({
    category: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    items: Joi.array().items(
        Joi.object({
            name: Joi.string().required().trim(),
            icon: Joi.string().trim().allow(''),

            useCases: Joi.alternatives()
                .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
            featured: Joi.alternatives()
                .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
        })
    ),
}).min(1);

export const createTechnologyItemSchema = Joi.object({
    name: Joi.string().required().trim().messages({
        'string.empty': 'Technology name is required',
        'any.required': 'Technology name is required',
    }),
    icon: Joi.string().trim().allow(''),

    useCases: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow(''))
        .default([]),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
        .default(false),
});

export const updateTechnologyItemSchema = Joi.object({
    name: Joi.string().trim(),
    icon: Joi.string().trim().allow(''),

    useCases: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
    featured: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
}).min(1);

export const technologyCategoryIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Category ID is required',
        'any.required': 'Category ID is required',
    }),
});

export const technologyItemIdSchema = Joi.object({
    categoryId: Joi.string().required().messages({
        'string.empty': 'Category ID is required',
        'any.required': 'Category ID is required',
    }),
    itemId: Joi.string().required().messages({
        'string.empty': 'Item ID is required',
        'any.required': 'Item ID is required',
    }),
});
