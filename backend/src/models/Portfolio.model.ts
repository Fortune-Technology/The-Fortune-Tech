/**
 * Portfolio Model
 * Mongoose schema for portfolio projects matching frontend schema exactly
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPortfolio } from '../interfaces';
import { generateSlug, getFullUrl } from '../utils/helpers';
import { PORTFOLIO_STATUSES } from '../constants';

export interface IPortfolioDocument extends Omit<IPortfolio, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const ClientSchema = new Schema(
    {
        name: { type: String, trim: true },
        location: { type: String, trim: true },
    },
    { _id: false }
);

const LinksSchema = new Schema(
    {
        live: { type: String, trim: true },
        caseStudy: { type: String, trim: true },
        github: { type: String, trim: true },
    },
    { _id: false }
);

const PortfolioSchema = new Schema<IPortfolioDocument>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            index: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        client: {
            type: ClientSchema,
            default: {},
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        longDescription: {
            type: String,
            trim: true,
        },
        keyFeatures: {
            type: [String],
            default: [],
        },
        technologyStack: [{
            type: String,
        }],
        metrics: {
            type: Schema.Types.Mixed,
            default: {},
        },
        timeline: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(PORTFOLIO_STATUSES),
            default: PORTFOLIO_STATUSES.COMPLETED,
        },
        servicesProvided: {
            type: [String],
            default: [],
        },
        links: {
            type: LinksSchema,
            default: {},
        },
        thumbnail: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.thumbnail = getFullUrl(ret.thumbnail);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.thumbnail = getFullUrl(ret.thumbnail);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Pre-save middleware to generate slug
PortfolioSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.slug) {
            this.slug = generateSlug(this.title);
        }
    }
    next();
});

// Text search index
PortfolioSchema.index({ title: 'text', description: 'text', category: 'text' });

const Portfolio: Model<IPortfolioDocument> = mongoose.model<IPortfolioDocument>(
    'Portfolio',
    PortfolioSchema
);

export default Portfolio;
