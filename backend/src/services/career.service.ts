import { Career, ICareerDocument } from '../models';
import { CreateCareerDTO, UpdateCareerDTO, PaginatedResult } from '../interfaces';
import { NotFoundError } from '../utils/errors';
import { parseArrayFromString, calculatePagination } from '../utils/helpers';

interface CareerQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    department?: string;
    type?: string;
    search?: string;
}

export class CareerService {
    static async getAll(query: CareerQuery): Promise<PaginatedResult<ICareerDocument>> {
        const { page = 1, pageSize = 10, sort = 'createdAt', order = 'desc', department, type, search } = query;

        const filter: Record<string, unknown> = {};
        if (department) filter.department = { $regex: department, $options: 'i' };
        if (type) filter.type = type;
        if (search) filter.$text = { $search: search };

        const total = await Career.countDocuments(filter);
        const { skip, limit, totalPages } = calculatePagination(page, pageSize, total);

        const careers = await Career.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        return {
            data: careers,
            pagination: { page, pageSize: limit, total, totalPages },
        };
    }

    static async getById(id: string): Promise<ICareerDocument> {
        const career = await Career.findById(id);
        if (!career) throw new NotFoundError('Career');
        return career;
    }

    static async create(data: CreateCareerDTO): Promise<ICareerDocument> {
        const career = new Career({
            title: data.title,
            department: data.department,
            location: data.location,
            experience: data.experience,
            type: data.type,
            description: data.description,
            requirements: parseArrayFromString(data.requirements as unknown as string),
            responsibilities: parseArrayFromString(data.responsibilities as unknown as string),
            benefits: parseArrayFromString(data.benefits as unknown as string),
            applyLink: data.applyLink,
        });

        await career.save();
        return career;
    }

    static async update(id: string, data: UpdateCareerDTO): Promise<ICareerDocument> {
        const career = await this.getById(id);

        const updateData: Record<string, unknown> = { ...data };

        if (data.requirements !== undefined) {
            updateData.requirements = parseArrayFromString(data.requirements as unknown as string);
        }
        if (data.responsibilities !== undefined) {
            updateData.responsibilities = parseArrayFromString(data.responsibilities as unknown as string);
        }
        if (data.benefits !== undefined) {
            updateData.benefits = parseArrayFromString(data.benefits as unknown as string);
        }

        Object.assign(career, updateData);
        await career.save();

        return career;
    }

    static async delete(id: string): Promise<void> {
        const career = await this.getById(id);
        await career.deleteOne();
    }
}
