/**
 * Website Config Model
 * Mongoose schema for website configuration (singleton pattern)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IWebsiteConfig } from '../interfaces';

export interface IWebsiteConfigDocument extends IWebsiteConfig, Document {
    _id: mongoose.Types.ObjectId;
}

const SiteSettingsSchema = new Schema(
    {
        name: { type: String, trim: true, default: 'The Fortune Tech' },
        tagline: { type: String, trim: true },
        description: { type: String, trim: true },
        url: { type: String, trim: true },
        logo: { type: String, trim: true },
        favicon: { type: String, trim: true },
    },
    { _id: false }
);



const CompanySettingsSchema = new Schema(
    {
        legalName: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: Schema.Types.Mixed, default: {} }, // Changed to Mixed to support object or string
        businessHours: { type: Schema.Types.Mixed, default: {} },
    },
    { _id: false }
);

const SocialSettingsSchema = new Schema(
    {
        linkedin: { type: String, trim: true },
        facebook: { type: String, trim: true },
        github: { type: String, trim: true },
    },
    { _id: false }
);

const SEOSettingsSchema = new Schema(
    {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        keywords: { type: [String], default: [] },
        ogImage: { type: String, trim: true },
    },
    { _id: false }
);

const WebsiteConfigSchema = new Schema<IWebsiteConfigDocument>(
    {
        site: {
            type: SiteSettingsSchema,
            default: {},
        },
        company: {
            type: CompanySettingsSchema,
            default: {},
        },
        social: {
            type: SocialSettingsSchema,
            default: {},
        },
        seo: {
            type: SEOSettingsSchema,
            default: {},
        },
        features: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                const { _id, __v, ...rest } = ret;
                return rest;
            },
        },
    }
);

// Static method to get or create the singleton config
WebsiteConfigSchema.statics.getConfig = async function (): Promise<IWebsiteConfigDocument> {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

// Ensure only one config document exists
WebsiteConfigSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingConfig = await (this.constructor as Model<IWebsiteConfigDocument>).findOne();
        if (existingConfig) {
            throw new Error('Website config already exists. Use update instead.');
        }
    }
    next();
});

interface IWebsiteConfigModel extends Model<IWebsiteConfigDocument> {
    getConfig(): Promise<IWebsiteConfigDocument>;
}

const WebsiteConfig = mongoose.model<IWebsiteConfigDocument, IWebsiteConfigModel>(
    'WebsiteConfig',
    WebsiteConfigSchema
);

export default WebsiteConfig;
