/**
 * Technology Category Model
 * Mongoose schema for technology categories with embedded items
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITechnologyCategory, ITechnologyItem } from '../interfaces';
import { generateSlug } from '../utils/helpers';


export interface ITechnologyCategoryDocument extends Omit<ITechnologyCategory, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const TechnologyItemSchema = new Schema<ITechnologyItem>(
    {
        name: {
            type: String,
            required: [true, 'Technology name is required'],
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },

        useCases: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    { _id: true }
);

const TechnologyCategorySchema = new Schema<ITechnologyCategoryDocument>(
    {
        category: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        items: {
            type: [TechnologyItemSchema],
            default: [],
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
TechnologyCategorySchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.slug) {
            this.slug = generateSlug(this.category);
        }
    }
    next();
});

const TechnologyCategory: Model<ITechnologyCategoryDocument> = mongoose.model<ITechnologyCategoryDocument>(
    'TechnologyCategory',
    TechnologyCategorySchema
);

export default TechnologyCategory;
