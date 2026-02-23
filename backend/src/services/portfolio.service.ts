import mongoose from 'mongoose';
import { Portfolio, IPortfolioDocument } from '../models';
import { CreatePortfolioDTO, UpdatePortfolioDTO, PaginatedResult } from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import {
    generateSlug,
    parseArrayFromString,
    parseBoolean,
    parseJSON,
    calculatePagination,
} from '../utils/helpers';

// Helper to parse technologyStack from various formats
const parseTechnologyStack = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        if (!value.trim()) return [];
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
            // Comma-separated string
            return value.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
};

interface PortfolioQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    featured?: boolean | string;
    category?: string;
    status?: string;
    search?: string;
}

export class PortfolioService {
    /**
     * Get all portfolio items with pagination
     */
    static async getAll(query: PortfolioQuery): Promise<PaginatedResult<IPortfolioDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', featured, category, status, search } = query;

        const filter: Record<string, unknown> = {};
        if (featured !== undefined) {
            filter.featured = parseBoolean(featured as string);
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        if (status) {
            filter.status = status;
        }
        if (search) {
            filter.$text = { $search: search };
        }

        const total = await Portfolio.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        const portfolios = await Portfolio.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: portfolios,
            pagination: { page, pageSize: limit, total, totalPages },
        };
    }

    /**
     * Get portfolio by ID or slug
     */
    static async getById(idOrSlug: string): Promise<IPortfolioDocument> {
        const query: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            query.$or.push({ _id: idOrSlug });
        }

        const portfolio = await Portfolio.findOne(query);

        if (!portfolio) {
            throw new NotFoundError('Portfolio');
        }

        return portfolio;
    }

    /**
     * Get featured portfolio items
     */
    static async getFeatured(limit: number = 6): Promise<IPortfolioDocument[]> {
        return Portfolio.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * Create a new portfolio item
     */
    static async create(
        data: CreatePortfolioDTO,
        thumbnailUrl?: string
    ): Promise<IPortfolioDocument> {
        const slug = generateSlug(data.title);

        const existing = await Portfolio.findOne({ slug });
        if (existing) {
            throw new ConflictError('A portfolio item with this title already exists');
        }

        const portfolio = new Portfolio({
            slug,
            title: data.title,
            category: data.category,
            industry: data.industry,
            client: {
                name: data.clientName,
                location: data.clientLocation,
            },
            description: data.description,
            longDescription: data.longDescription,
            keyFeatures: parseArrayFromString(data.keyFeatures as unknown as string),
            technologyStack: parseTechnologyStack(data.technologyStack),
            metrics: parseJSON(data.metrics as unknown as string, {}),
            timeline: data.timeline,
            status: data.status,
            servicesProvided: parseArrayFromString(data.servicesProvided as unknown as string),
            links: {
                live: data.liveLink,
                caseStudy: data.caseStudyLink,
                github: data.githubLink,
            },
            thumbnail: thumbnailUrl,
            featured: parseBoolean(data.featured as unknown as string),
        });

        await portfolio.save();
        return portfolio;
    }

    /**
     * Update a portfolio item
     */
    static async update(
        idOrSlug: string,
        data: UpdatePortfolioDTO,
        thumbnailUrl?: string
    ): Promise<IPortfolioDocument> {
        const portfolio = await this.getById(idOrSlug);

        const updateData: Record<string, unknown> = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.industry !== undefined) updateData.industry = data.industry;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.longDescription !== undefined) updateData.longDescription = data.longDescription;
        if (data.timeline !== undefined) updateData.timeline = data.timeline;
        if (data.status !== undefined) updateData.status = data.status;
        if (thumbnailUrl) updateData.thumbnail = thumbnailUrl;

        if (data.clientName !== undefined || data.clientLocation !== undefined) {
            updateData.client = {
                name: data.clientName ?? portfolio.client.name,
                location: data.clientLocation ?? portfolio.client.location,
            };
        }

        if (data.keyFeatures !== undefined) {
            updateData.keyFeatures = parseArrayFromString(data.keyFeatures as unknown as string);
        }
        if (data.metrics !== undefined) {
            updateData.metrics = parseJSON(data.metrics as unknown as string, portfolio.metrics);
        }
        if (data.servicesProvided !== undefined) {
            updateData.servicesProvided = parseArrayFromString(data.servicesProvided as unknown as string);
        }
        if (data.featured !== undefined) {
            updateData.featured = parseBoolean(data.featured as unknown as string);
        }
        if (data.technologyStack !== undefined) {
            updateData.technologyStack = parseTechnologyStack(data.technologyStack);
        }

        if (data.liveLink !== undefined || data.caseStudyLink !== undefined || data.githubLink !== undefined) {
            updateData.links = {
                live: data.liveLink ?? portfolio.links.live,
                caseStudy: data.caseStudyLink ?? portfolio.links.caseStudy,
                github: data.githubLink ?? portfolio.links.github,
            };
        }

        Object.assign(portfolio, updateData);
        await portfolio.save();

        return portfolio;
    }

    /**
     * Delete a portfolio item
     */
    static async delete(idOrSlug: string): Promise<void> {
        const portfolio = await this.getById(idOrSlug);
        await portfolio.deleteOne();
    }
}
