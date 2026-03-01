/**
 * CMS Page Model
 * Mongoose schema for CMS pages matching frontend schema exactly
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICMSPage } from '../interfaces';
import { generateSlug } from '../utils/helpers';
import { CMS_STATUSES } from '../constants';

export interface ICMSPageDocument extends Omit<ICMSPage, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const CMSPageSchema = new Schema<ICMSPageDocument>(
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
        status: {
            type: String,
            enum: Object.values(CMS_STATUSES),
            default: CMS_STATUSES.DRAFT,
            index: true,
        },
        metaTitle: {
            type: String,
            trim: true,
        },
        metaDescription: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Pre-save middleware to generate slug
CMSPageSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.slug) {
            this.slug = generateSlug(this.title);
        }
    }
    next();
});

// Text search index
CMSPageSchema.index({ title: 'text', content: 'text' });

const CMSPage: Model<ICMSPageDocument> = mongoose.model<ICMSPageDocument>(
    'CMSPage',
    CMSPageSchema
);

export default CMSPage;
