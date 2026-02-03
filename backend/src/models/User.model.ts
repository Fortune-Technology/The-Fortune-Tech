/**
 * User Model
 * Mongoose schema for users with authentication and profile data
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';
import { getFullUrl } from '../utils/helpers';
import { USER_ROLES, USER_STATUSES, ROLE_PERMISSIONS, UserRole, Permission } from '../constants';

export interface IUserDocument extends Omit<IUser, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
    getPermissions(): Permission[];
}

const ProfileSchema = new Schema(
    {
        bio: { type: String, trim: true },
        phone: { type: String, trim: true },
        location: { type: String, trim: true },
        department: { type: String, trim: true },
        position: { type: String, trim: true },
        company: { type: String, trim: true },
    },
    { _id: false }
);

const NotificationPreferencesSchema = new Schema(
    {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
    },
    { _id: false }
);

const PreferencesSchema = new Schema(
    {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        notifications: {
            type: NotificationPreferencesSchema,
            default: {},
        },
        language: {
            type: String,
            default: 'en',
        },
    },
    { _id: false }
);

const SecuritySchema = new Schema(
    {
        twoFactorEnabled: { type: Boolean, default: false },
        lastLogin: { type: Date },
        loginAttempts: { type: Number, default: 0 },
        lockoutUntil: { type: Date },
        passwordChangedAt: { type: Date },
    },
    { _id: false }
);

const MetadataSchema = new Schema(
    {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: { type: String },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        displayName: {
            type: String,
            trim: true,
            maxlength: [100, 'Display name cannot exceed 100 characters'],
        },
        avatar: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.CLIENT,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(USER_STATUSES),
            default: USER_STATUSES.PENDING,
            index: true,
        },
        permissions: {
            type: [String],
            default: [],
        },
        profile: {
            type: ProfileSchema,
            default: {},
        },
        preferences: {
            type: PreferencesSchema,
            default: {},
        },
        security: {
            type: SecuritySchema,
            default: {},
        },
        metadata: {
            type: MetadataSchema,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.avatar = getFullUrl(ret.avatar);
                delete ret._id;
                delete ret.__v;
                delete ret.password;

                // Flatten common fields for frontend
                ret.name = ret.displayName || `${ret.firstName} ${ret.lastName}`;
                ret.lastLogin = ret.security?.lastLogin;

                if (ret.metadata) {
                    delete ret.metadata.verificationToken;
                    delete ret.metadata.resetPasswordToken;
                    delete ret.metadata.resetPasswordExpires;
                }
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret: any) => {
                ret.id = ret._id.toString();
                ret.avatar = getFullUrl(ret.avatar);
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            },
        },
    }
);

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
    // Generate display name if not provided
    if (this.isNew && !this.displayName) {
        this.displayName = `${this.firstName} ${this.lastName}`;
    } else if ((this.isModified('firstName') || this.isModified('lastName')) && !this.isModified('displayName')) {
        // Update display name if name fields change and display name wasn't manually updated
        this.displayName = `${this.firstName} ${this.lastName}`;
    }

    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        this.security.passwordChangedAt = new Date();
    }

    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions (role + custom)
UserSchema.methods.getPermissions = function (): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS[this.role as UserRole] || [];
    const customPermissions = this.permissions || [];

    // Combine and deduplicate
    return [...new Set([...rolePermissions, ...customPermissions])] as Permission[];
};

// Text search index
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
