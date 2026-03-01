/**
 * Career Model
 * Mongoose schema for job postings matching frontend schema exactly
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICareer } from '../interfaces';
import { JOB_TYPES } from '../constants';

export interface ICareerDocument extends Omit<ICareer, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const CareerSchema = new Schema<ICareerDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
            index: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        experience: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: Object.values(JOB_TYPES),
            default: JOB_TYPES.FULL_TIME,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        requirements: {
            type: [String],
            default: [],
        },
        benefits: {
            type: [String],
            default: [],
        },
        applyLink: {
            type: String,
            trim: true,
        },
        responsibilities: {
            type: [String],
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

// Text search index
CareerSchema.index({ title: 'text', description: 'text', department: 'text' });

const Career: Model<ICareerDocument> = mongoose.model<ICareerDocument>(
    'Career',
    CareerSchema
);

export default Career;
