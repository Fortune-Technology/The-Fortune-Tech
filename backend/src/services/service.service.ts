import mongoose from 'mongoose';
import { Service, IServiceDocument } from '../models';
import { CreateServiceDTO, UpdateServiceDTO, PaginatedResult } from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import {
    generateSlug,
    parseArrayFromString,
    parseBoolean,
    calculatePagination,
} from '../utils/helpers';

interface ServiceQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    featured?: boolean | string;
    search?: string;
}

export class ServiceService {
    /**
     * Get all services with pagination
     */
    static async getAll(query: ServiceQuery): Promise<PaginatedResult<IServiceDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', featured, search } = query;

        // Build filter
        const filter: Record<string, unknown> = {};
        if (featured !== undefined) {
            filter.featured = parseBoolean(featured as string);
        }
        if (search) {
            filter.$text = { $search: search };
        }

        // Get total count
        const total = await Service.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        // Get services
        const services = await Service.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: services,
            pagination: {
                page,
                pageSize: limit,
                total,
                totalPages,
            },
        };
    }

    /**
     * Get service by ID or slug
     */
    static async getById(idOrSlug: string): Promise<IServiceDocument> {
        const query: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            query.$or.push({ _id: idOrSlug });
        }

        const service = await Service.findOne(query);

        if (!service) {
            throw new NotFoundError('Service');
        }

        return service;
    }

    /**
     * Get featured services
     */
    static async getFeatured(limit: number = 6): Promise<IServiceDocument[]> {
        return Service.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * Create a new service
     */
    static async create(
        data: CreateServiceDTO,
        imageUrl?: string,
        thumbnailUrl?: string
    ): Promise<IServiceDocument> {
        const slug = generateSlug(data.title);

        // Check if service with this slug already exists
        const existing = await Service.findOne({ slug });
        if (existing) {
            throw new ConflictError('A service with this title already exists');
        }

        const service = new Service({
            ...data,
            slug,
            image: imageUrl,
            thumbnail: thumbnailUrl,
            features: parseArrayFromString(data.features as unknown as string),
            deliverables: parseArrayFromString(data.deliverables as unknown as string),
            process: parseArrayFromString(data.process as unknown as string),
            techStack: parseArrayFromString(data.techStack as unknown as string),
            benefits: parseArrayFromString(data.benefits as unknown as string),
            idealFor: parseArrayFromString(data.idealFor as unknown as string),
            featured: parseBoolean(data.featured as unknown as string),
            seo: {
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
            },
        });

        await service.save();
        return service;
    }

    /**
     * Update a service
     */
    static async update(
        idOrSlug: string,
        data: UpdateServiceDTO,
        imageUrl?: string,
        thumbnailUrl?: string
    ): Promise<IServiceDocument> {
        const service = await this.getById(idOrSlug);

        // Prepare update data
        const updateData: Record<string, unknown> = { ...data };

        if (imageUrl) {
            updateData.image = imageUrl;
        }
        if (thumbnailUrl) {
            updateData.thumbnail = thumbnailUrl;
        }

        // Parse array fields
        if (data.features !== undefined) {
            updateData.features = parseArrayFromString(data.features as unknown as string);
        }
        if (data.deliverables !== undefined) {
            updateData.deliverables = parseArrayFromString(data.deliverables as unknown as string);
        }
        if (data.process !== undefined) {
            updateData.process = parseArrayFromString(data.process as unknown as string);
        }
        if (data.techStack !== undefined) {
            updateData.techStack = parseArrayFromString(data.techStack as unknown as string);
        }
        if (data.benefits !== undefined) {
            updateData.benefits = parseArrayFromString(data.benefits as unknown as string);
        }
        if (data.idealFor !== undefined) {
            updateData.idealFor = parseArrayFromString(data.idealFor as unknown as string);
        }
        if (data.featured !== undefined) {
            updateData.featured = parseBoolean(data.featured as unknown as string);
        }

        // Handle SEO
        if (data.metaTitle !== undefined || data.metaDescription !== undefined) {
            updateData.seo = {
                metaTitle: data.metaTitle ?? service.seo.metaTitle,
                metaDescription: data.metaDescription ?? service.seo.metaDescription,
            };
        }

        // Remove flat SEO fields
        delete updateData.metaTitle;
        delete updateData.metaDescription;

        Object.assign(service, updateData);
        await service.save();

        return service;
    }

    /**
     * Delete a service
     */
    static async delete(idOrSlug: string): Promise<void> {
        const service = await this.getById(idOrSlug);
        await service.deleteOne();
    }
}
