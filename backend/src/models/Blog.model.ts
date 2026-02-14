/**
 * Blog Model
 * Mongoose schema for blog posts with SEO, AEO, and GEO support
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { generateSlug, getFullUrl } from '../utils/helpers';

// FAQ sub-document interface
export interface IFAQItem {
    question: string;
    answer: string;
}

// Blog document interface
export interface IBlogDocument extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
    faqSection: IFAQItem[];
    author: string;
    status: 'draft' | 'published';
    publishedAt?: Date;
    readingTime: number;
    schemaType: string;
    createdAt: Date;
    updatedAt: Date;
}

// FAQ sub-schema
const FAQSchema = new Schema(
    {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
    },
    { _id: false }
);

// Blog schema
const BlogSchema = new Schema<IBlogDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [300, 'Title cannot exceed 300 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
            maxlength: [500, 'Excerpt cannot exceed 500 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        featuredImage: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        metaTitle: {
            type: String,
            trim: true,
            maxlength: [70, 'Meta title cannot exceed 70 characters'],
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: [160, 'Meta description cannot exceed 160 characters'],
        },
        faqSection: {
            type: [FAQSchema],
            default: [],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
            index: true,
        },
        publishedAt: {
            type: Date,
            index: true,
        },
        readingTime: {
            type: Number,
            default: 1,
        },
        schemaType: {
            type: String,
            default: 'BlogPosting',
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.featuredImage = getFullUrl(ret.featuredImage);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.featuredImage = getFullUrl(ret.featuredImage);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

/**
 * Calculate reading time from content (avg 200 words per minute)
 */
function calculateReadingTime(content: string): number {
    const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

// Pre-save middleware
BlogSchema.pre('save', function (next) {
    // Auto-generate slug from title
    if (this.isNew && !this.slug) {
        this.slug = generateSlug(this.title);
    }

    // Auto-calculate reading time
    if (this.isModified('content')) {
        this.readingTime = calculateReadingTime(this.content);
    }

    // Auto-set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

// Text search index
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Compound indexes for common queries
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, status: 1 });

const Blog: Model<IBlogDocument> = mongoose.model<IBlogDocument>(
    'Blog',
    BlogSchema
);

export default Blog;
