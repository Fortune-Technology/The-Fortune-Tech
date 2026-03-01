import mongoose from 'mongoose';
import { User, IUserDocument } from '../models';
import { CreateUserDTO, UpdateUserDTO, PaginatedResult } from '../interfaces';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { parseArrayFromString, calculatePagination } from '../utils/helpers';
import { USER_STATUSES } from '../constants';
import { sendEmail } from '../utils/email';

interface UserQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    role?: string;
    status?: string;
    search?: string;
}

export class UserService {
    static async getAll(query: UserQuery): Promise<PaginatedResult<IUserDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', role, status, search } = query;

        const filter: Record<string, unknown> = {};
        if (role) filter.role = role;
        if (status) filter.status = status;
        if (search) filter.$text = { $search: search };

        const total = await User.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        const users = await User.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: users,
            pagination: { page, pageSize: limit, total, totalPages },
        };
    }

    static async getById(idOrEmail: string): Promise<IUserDocument> {
        const query: any = { $or: [{ email: idOrEmail.toLowerCase() }] };
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
            query.$or.push({ _id: idOrEmail });
        }

        const user = await User.findOne(query);

        if (!user) throw new NotFoundError('User');
        return user;
    }

    static async getByEmail(email: string): Promise<IUserDocument | null> {
        return User.findOne({ email: email.toLowerCase() }).select('+password');
    }

    static async create(data: CreateUserDTO, avatarUrl?: string): Promise<IUserDocument> {
        // Check if user exists
        const existing = await User.findOne({ email: data.email.toLowerCase() });
        if (existing) throw new ConflictError('An account with this email already exists');

        const user = new User({
            email: data.email.toLowerCase(),
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: data.displayName || `${data.firstName} ${data.lastName}`,
            avatar: avatarUrl,
            role: data.role,
            status: data.status || USER_STATUSES.PENDING,
            permissions: parseArrayFromString(data.permissions as unknown as string),
            profile: {
                bio: data.bio,
                phone: data.phone,
                location: data.location,
                department: data.department,
                position: data.position,
                company: data.company,
            },
        });

        await user.save();

        // Send welcome email
        try {
            await sendEmail(
                user.email,
                'Welcome to The Fortune Tech',
                `<h3>Welcome, ${user.firstName}!</h3>
                <p>Your account has been created successfully.</p>
                <p><strong>Login Credentials:</strong></p>
                <p>Email: ${user.email}</p>
                <p>Password: ${data.password}</p>
                <p>Please login and change your password immediately.</p>`
            );
        } catch (error) {
            console.error('Failed to send welcome email', error);
        }

        return user;
    }

    static async update(idOrEmail: string, data: UpdateUserDTO, avatarUrl?: string): Promise<IUserDocument> {
        const user = await this.getById(idOrEmail);

        // Update basic fields
        if (data.firstName !== undefined) user.firstName = data.firstName;
        if (data.lastName !== undefined) user.lastName = data.lastName;
        if (data.displayName !== undefined) user.displayName = data.displayName;
        if (data.role !== undefined) user.role = data.role as never;
        if (data.status !== undefined) user.status = data.status as never;
        if (avatarUrl) user.avatar = avatarUrl;

        // Update permissions
        if (data.permissions !== undefined) {
            user.permissions = parseArrayFromString(data.permissions as unknown as string) as never;
        }

        // Update profile
        if (data.bio !== undefined) user.profile.bio = data.bio;
        if (data.phone !== undefined) user.profile.phone = data.phone;
        if (data.location !== undefined) user.profile.location = data.location;
        if (data.department !== undefined) user.profile.department = data.department;
        if (data.position !== undefined) user.profile.position = data.position;
        if (data.company !== undefined) user.profile.company = data.company;

        if (data.password) {
            user.password = data.password;
            try {
                await sendEmail(
                    user.email,
                    'Your Password Has Been Reset',
                    `<h3>Hello ${user.firstName},</h3>
                    <p>An administrator has reset your password.</p>
                    <p><strong>New Password:</strong> ${data.password}</p>
                    <p>Please login and change your password immediately.</p>`
                );
            } catch (error) {
                console.error('Failed to send password reset email', error);
            }
        }

        await user.save();
        return user;
    }

    static async changePassword(
        idOrEmail: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const query: any = { $or: [{ email: idOrEmail.toLowerCase() }] };
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
            query.$or.push({ _id: idOrEmail });
        }

        const user = await User.findOne(query).select('+password');

        if (!user) throw new NotFoundError('User');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) throw new ValidationError('Current password is incorrect');

        user.password = newPassword;
        await user.save();

        try {
            await sendEmail(
                user.email,
                'Your Password Has Been Changed',
                `<h3>Hello ${user.firstName},</h3>
                <p>Your password was successfully changed.</p>
                <p>If you did not make this change, please contact support immediately.</p>`
            );
        } catch (error) {
            console.error('Failed to send password change email', error);
        }
    }

    static async delete(idOrEmail: string): Promise<void> {
        const user = await this.getById(idOrEmail);
        await user.deleteOne();
    }

    static async updateLastLogin(idOrEmail: string): Promise<void> {
        const query: any = { $or: [{ email: idOrEmail.toLowerCase() }] };
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
            query.$or.push({ _id: idOrEmail });
        }

        await User.findOneAndUpdate(
            query,
            { 'security.lastLogin': new Date(), 'security.loginAttempts': 0 }
        );
    }

    static async incrementLoginAttempts(email: string): Promise<void> {
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $inc: { 'security.loginAttempts': 1 } }
        );
    }
}
