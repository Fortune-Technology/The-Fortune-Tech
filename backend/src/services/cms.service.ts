import mongoose from 'mongoose';
import { CMSPage, ICMSPageDocument } from '../models';
import { CreateCMSPageDTO, UpdateCMSPageDTO, PaginatedResult } from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import { generateSlug, calculatePagination } from '../utils/helpers';
import { CMS_STATUSES } from '../constants';

interface CMSQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: string;
    search?: string;
}

export class CMSService {
    private static getPageQuery(idOrSlug: string): any {
        const query: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            query.$or.push({ _id: idOrSlug });
        }
        return query;
    }

    static async getAll(query: CMSQuery): Promise<PaginatedResult<ICMSPageDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', status, search } = query;

        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (search) filter.$text = { $search: search };

        const total = await CMSPage.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        const pages = await CMSPage.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: pages,
            pagination: { page, pageSize: limit, total, totalPages },
        };
    }

    static async getById(idOrSlug: string): Promise<ICMSPageDocument> {
        const page = await CMSPage.findOne(this.getPageQuery(idOrSlug));
        if (!page) throw new NotFoundError('CMS Page');
        return page;
    }

    static async getBySlug(slug: string): Promise<ICMSPageDocument> {
        const page = await CMSPage.findOne({ slug, status: CMS_STATUSES.PUBLISHED });
        if (!page) throw new NotFoundError('CMS Page');
        return page;
    }

    static async getPublished(): Promise<ICMSPageDocument[]> {
        return CMSPage.find({ status: CMS_STATUSES.PUBLISHED }).sort({ title: 1 });
    }

    static async create(data: CreateCMSPageDTO): Promise<ICMSPageDocument> {
        const slug = data.slug || generateSlug(data.title);

        const existing = await CMSPage.findOne({ slug });
        if (existing) throw new ConflictError('A page with this slug already exists');

        const page = new CMSPage({
            slug,
            title: data.title,
            status: data.status || CMS_STATUSES.DRAFT,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            content: data.content,
        });

        await page.save();
        return page;
    }

    static async update(idOrSlug: string, data: UpdateCMSPageDTO): Promise<ICMSPageDocument> {
        const page = await this.getById(idOrSlug);

        // Check slug conflict if changing
        if (data.slug && data.slug !== page.slug) {
            const existing = await CMSPage.findOne({ slug: data.slug });
            if (existing) throw new ConflictError('A page with this slug already exists');
        }

        Object.assign(page, data);
        await page.save();

        return page;
    }

    static async delete(idOrSlug: string): Promise<void> {
        const page = await this.getById(idOrSlug);
        await page.deleteOne();
    }

    static async publish(idOrSlug: string): Promise<ICMSPageDocument> {
        const page = await this.getById(idOrSlug);

        page.status = CMS_STATUSES.PUBLISHED;
        await page.save();

        return page;
    }

    static async unpublish(idOrSlug: string): Promise<ICMSPageDocument> {
        const page = await this.getById(idOrSlug);

        page.status = CMS_STATUSES.DRAFT;
        await page.save();

        return page;
    }
}
