import mongoose from 'mongoose';
import { Testimonial, ITestimonialDocument } from '../models';
import { CreateTestimonialDTO, UpdateTestimonialDTO, PaginatedResult } from '../interfaces';
import { NotFoundError } from '../utils/errors';
import { generateSlug, parseBoolean, parseJSON, calculatePagination, parseNumber } from '../utils/helpers';

interface TestimonialQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    featured?: boolean | string;
    verified?: boolean | string;
    search?: string;
}

export class TestimonialService {
    static async getAll(query: TestimonialQuery): Promise<PaginatedResult<ITestimonialDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', featured, verified, search } = query;

        const filter: Record<string, unknown> = {};
        if (featured !== undefined) filter.featured = parseBoolean(featured as string);
        if (verified !== undefined) filter.verified = parseBoolean(verified as string);
        if (search) filter.$text = { $search: search };

        const total = await Testimonial.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        const testimonials = await Testimonial.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: testimonials,
            pagination: { page, pageSize: limit, total, totalPages },
        };
    }

    static async getById(idOrSlug: string): Promise<ITestimonialDocument> {
        const query: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            query.$or.push({ _id: idOrSlug });
        }

        const testimonial = await Testimonial.findOne(query);

        if (!testimonial) throw new NotFoundError('Testimonial');
        return testimonial;
    }

    static async getFeatured(limit: number = 6): Promise<ITestimonialDocument[]> {
        return Testimonial.find({ featured: true, verified: true })
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);
    }

    static async create(data: CreateTestimonialDTO, avatarUrl?: string, thumbnailUrl?: string): Promise<ITestimonialDocument> {
        const slug = generateSlug(`${data.name}-${data.company || 'testimonial'}`);

        const testimonial = new Testimonial({
            slug,
            name: data.name,
            role: data.role,
            company: data.company,
            industry: data.industry,
            serviceProvided: data.serviceProvided,
            projectType: data.projectType,
            rating: parseNumber(data.rating as unknown as string, 5),
            content: data.content,
            metrics: parseJSON(data.metrics as unknown as string, {}),
            avatar: avatarUrl,
            thumbnail: thumbnailUrl,
            linkedin: data.linkedin,
            website: data.website,
            verified: parseBoolean(data.verified as unknown as string),
            featured: parseBoolean(data.featured as unknown as string),
        });

        await testimonial.save();
        return testimonial;
    }

    static async update(idOrSlug: string, data: UpdateTestimonialDTO, avatarUrl?: string, thumbnailUrl?: string): Promise<ITestimonialDocument> {
        const testimonial = await this.getById(idOrSlug);

        const updateData: Record<string, unknown> = { ...data };

        if (avatarUrl) updateData.avatar = avatarUrl;
        if (thumbnailUrl) updateData.thumbnail = thumbnailUrl;
        if (data.rating !== undefined) updateData.rating = parseNumber(data.rating as unknown as string, testimonial.rating);
        if (data.metrics !== undefined) updateData.metrics = parseJSON(data.metrics as unknown as string, testimonial.metrics);
        if (data.verified !== undefined) updateData.verified = parseBoolean(data.verified as unknown as string);
        if (data.featured !== undefined) updateData.featured = parseBoolean(data.featured as unknown as string);

        Object.assign(testimonial, updateData);
        await testimonial.save();

        return testimonial;
    }

    static async delete(idOrSlug: string): Promise<void> {
        const testimonial = await this.getById(idOrSlug);
        await testimonial.deleteOne();
    }
}
