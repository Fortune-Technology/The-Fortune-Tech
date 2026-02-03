/**
 * Testimonial Model
 * Mongoose schema for testimonials matching frontend schema exactly
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITestimonial } from '../interfaces';
import { generateSlug, getFullUrl } from '../utils/helpers';

export interface ITestimonialDocument extends Omit<ITestimonial, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const TestimonialSchema = new Schema<ITestimonialDocument>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        role: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        serviceProvided: {
            type: String,
            trim: true,
        },
        projectType: {
            type: String,
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
        },
        metrics: {
            type: Schema.Types.Mixed,
            default: {},
        },
        avatar: {
            type: String,
            trim: true,
        },
        thumbnail: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: true,
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
                ret.avatar = getFullUrl(ret.avatar);
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
                ret.avatar = getFullUrl(ret.avatar);
                ret.thumbnail = getFullUrl(ret.thumbnail);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Pre-save middleware to generate slug
TestimonialSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.slug) {
            const company = this.company ? `-${this.company}` : '';
            this.slug = generateSlug(`${this.name}${company}`);
        }
    }
    next();
});

// Text search index
TestimonialSchema.index({ name: 'text', company: 'text', content: 'text' });

const Testimonial: Model<ITestimonialDocument> = mongoose.model<ITestimonialDocument>(
    'Testimonial',
    TestimonialSchema
);

export default Testimonial;
