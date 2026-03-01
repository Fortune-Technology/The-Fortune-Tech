/**
 * Technology Service
 * Business logic for technology categories and items management
 */

import { TechnologyCategory, ITechnologyCategoryDocument } from '../models';
import {
    CreateTechnologyCategoryDTO,
    UpdateTechnologyCategoryDTO,
    CreateTechnologyItemDTO,
    UpdateTechnologyItemDTO,
    ITechnologyItem,
} from '../interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import { generateSlug, parseArrayFromString, parseBoolean } from '../utils/helpers';
import mongoose from 'mongoose';

export class TechnologyService {
    /**
     * Helper to build category query
     */
    private static getCategoryQuery(idOrSlug: string): any {
        const query: any = { $or: [{ slug: idOrSlug }] };
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            query.$or.push({ _id: idOrSlug });
        }
        return query;
    }

    /**
     * Get all technology categories
     */
    static async getAll(): Promise<ITechnologyCategoryDocument[]> {
        return TechnologyCategory.find().sort({ category: 1 });
    }

    /**
     * Get category by ID or slug
     */
    static async getCategoryById(idOrSlug: string): Promise<ITechnologyCategoryDocument> {
        const category = await TechnologyCategory.findOne(this.getCategoryQuery(idOrSlug));

        if (!category) {
            throw new NotFoundError('Technology Category');
        }

        return category;
    }

    /**
     * Get all featured technologies across categories
     */
    static async getFeatured(): Promise<ITechnologyItem[]> {
        const categories = await TechnologyCategory.find();
        const featuredItems: ITechnologyItem[] = [];

        categories.forEach((category) => {
            category.items.forEach((item) => {
                if (item.featured) {
                    featuredItems.push(item);
                }
            });
        });

        return featuredItems;
    }

    /**
     * Create a new category
     */
    static async createCategory(
        data: CreateTechnologyCategoryDTO
    ): Promise<ITechnologyCategoryDocument> {
        const slug = generateSlug(data.category);

        const existing = await TechnologyCategory.findOne({ slug });
        if (existing) {
            throw new ConflictError('A category with this name already exists');
        }

        // Process items if provided
        const items = (data.items || []).map((item) => ({
            ...item,
            useCases: parseArrayFromString(item.useCases as unknown as string),
            featured: parseBoolean(item.featured as unknown as string),
        }));

        const category = new TechnologyCategory({
            slug,
            category: data.category,
            description: data.description,
            items,
        });

        await category.save();
        return category;
    }

    /**
     * Update a category
     */
    static async updateCategory(
        idOrSlug: string,
        data: UpdateTechnologyCategoryDTO
    ): Promise<ITechnologyCategoryDocument> {
        const category = await this.getCategoryById(idOrSlug);

        if (data.category !== undefined) category.category = data.category;
        if (data.description !== undefined) category.description = data.description;

        if (data.items !== undefined) {
            category.items = data.items.map((item) => ({
                ...item,
                useCases: parseArrayFromString(item.useCases as unknown as string),
                featured: parseBoolean(item.featured as unknown as string),
            })) as mongoose.Types.DocumentArray<ITechnologyItem>;
        }

        await category.save();
        return category;
    }

    /**
     * Delete a category
     */
    static async deleteCategory(idOrSlug: string): Promise<void> {
        const category = await this.getCategoryById(idOrSlug);
        await category.deleteOne();
    }

    /**
     * Add an item to a category
     */
    static async addItem(
        categoryIdOrSlug: string,
        data: CreateTechnologyItemDTO
    ): Promise<ITechnologyCategoryDocument> {
        const category = await this.getCategoryById(categoryIdOrSlug);

        const newItem: ITechnologyItem = {
            name: data.name,
            icon: data.icon,

            useCases: parseArrayFromString(data.useCases as unknown as string),
            featured: parseBoolean(data.featured as unknown as string),
        };

        category.items.push(newItem as never);
        await category.save();

        return category;
    }

    /**
     * Update an item in a category
     */
    static async updateItem(
        categoryIdOrSlug: string,
        itemId: string,
        data: UpdateTechnologyItemDTO
    ): Promise<ITechnologyCategoryDocument> {
        const category = await this.getCategoryBySlugOrId(categoryIdOrSlug);

        const itemIndex = category.items.findIndex(
            (item) => (item as unknown as { _id: mongoose.Types.ObjectId })._id.toString() === itemId
        );

        if (itemIndex === -1) {
            throw new NotFoundError('Technology Item');
        }

        const item = category.items[itemIndex];

        if (data.name !== undefined) item.name = data.name;
        if (data.icon !== undefined) item.icon = data.icon;

        if (data.useCases !== undefined) {
            item.useCases = parseArrayFromString(data.useCases as unknown as string);
        }
        if (data.featured !== undefined) {
            item.featured = parseBoolean(data.featured as unknown as string);
        }

        await category.save();
        return category;
    }

    /**
     * Delete an item from a category
     */
    static async deleteItem(
        categoryIdOrSlug: string,
        itemId: string
    ): Promise<ITechnologyCategoryDocument> {
        const category = await this.getCategoryBySlugOrId(categoryIdOrSlug);

        const itemIndex = category.items.findIndex(
            (item) => (item as unknown as { _id: mongoose.Types.ObjectId })._id.toString() === itemId
        );

        if (itemIndex === -1) {
            throw new NotFoundError('Technology Item');
        }

        category.items.splice(itemIndex, 1);
        await category.save();

        return category;
    }

    // Helper for consistency in method names used in updateItem/deleteItem
    private static async getCategoryBySlugOrId(idOrSlug: string) {
        return this.getCategoryById(idOrSlug);
    }
}
