/**
 * Settings DTO
 * Joi validation schemas for website settings operations
 */

import Joi from 'joi';

export const updateSettingsSchema = Joi.object({
    site: Joi.object({
        name: Joi.string().trim().allow(''),
        tagline: Joi.string().trim().allow(''),
        description: Joi.string().trim().allow(''),
        url: Joi.string().uri().trim().allow(''),
        logo: Joi.string().trim().allow(''),
        favicon: Joi.string().trim().allow(''),
    }),
    company: Joi.object({
        legalName: Joi.string().trim().allow(''),
        email: Joi.string().email().trim().allow(''),
        phone: Joi.string().trim().allow(''),
        address: Joi.alternatives().try(
            Joi.string().trim().allow(''),
            Joi.object({
                street: Joi.string().trim().allow(''),
                city: Joi.string().trim().allow(''),
                state: Joi.string().trim().allow(''),
                postalCode: Joi.string().trim().allow(''),
                country: Joi.string().trim().allow(''),
            })
        ),
        businessHours: Joi.object().pattern(Joi.string(), Joi.string()),
    }),
    social: Joi.object({
        linkedin: Joi.string().uri().trim().allow(''),
        twitter: Joi.string().uri().trim().allow(''),
        github: Joi.string().uri().trim().allow(''),
        dribbble: Joi.string().uri().trim().allow(''),
        facebook: Joi.string().uri().trim().allow(''),
        instagram: Joi.string().uri().trim().allow(''),
        youtube: Joi.string().uri().trim().allow(''),
    }),
    seo: Joi.object({
        title: Joi.string().trim().allow(''),
        description: Joi.string().trim().allow(''),
        keywords: Joi.alternatives()
            .try(Joi.array().items(Joi.string().trim()), Joi.string().allow('')),
        ogImage: Joi.string().trim().allow(''),
    }),
    features: Joi.object({
        maintenanceMode: Joi.boolean(),
        maintenanceMessage: Joi.string().allow(''),
        googleAnalytics: Joi.string().allow(''),
        facebookPixel: Joi.string().allow(''),
    }).unknown(true),
}).min(1).unknown(true);
