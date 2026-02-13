/**
 * Service Model
 * Mongoose schema for services matching frontend schema exactly
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IService } from '../interfaces';
import { generateSlug, getFullUrl } from '../utils/helpers';

export interface IServiceDocument extends Omit<IService, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const SEOSchema = new Schema(
    {
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },
    },
    { _id: false }
);

const ServiceSchema = new Schema<IServiceDocument>(
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
        tagline: {
            type: String,
            trim: true,
            maxlength: [300, 'Tagline cannot exceed 300 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        overview: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        thumbnail: {
            type: String,
            trim: true,
        },
        features: {
            type: [String],
            default: [],
        },
        deliverables: {
            type: [String],
            default: [],
        },
        process: {
            type: [String],
            default: [],
        },
        techStack: {
            type: [String],
            default: [],
        },
        benefits: {
            type: [String],
            default: [],
        },
        idealFor: {
            type: [String],
            default: [],
        },
        cta: {
            type: String,
            trim: true,
        },
        seo: {
            type: SEOSchema,
            default: {},
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
                ret.image = getFullUrl(ret.image);
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
                ret.image = getFullUrl(ret.image);
                ret.thumbnail = getFullUrl(ret.thumbnail);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Pre-save middleware to generate slug
ServiceSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.slug) {
            this.slug = generateSlug(this.title);
        }
    }
    next();
});

// Indexes for better query performance
ServiceSchema.index({ title: 'text', description: 'text', tagline: 'text' });

const Service: Model<IServiceDocument> = mongoose.model<IServiceDocument>(
    'Service',
    ServiceSchema
);

export default Service;
