/**
 * Helper Utilities
 * Common utility functions
 */

import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Get full URL for a path (prepends API_URL if path starts with /uploads)
 */
export const getFullUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) {
        return `${env.API_URL}${path}`;
    }
    return path;
};

/**
 * Generate a URL-friendly slug from a string
 */
export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')     // Remove special characters
        .replace(/[\s_-]+/g, '-')      // Replace spaces, underscores with hyphens
        .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
};

/**
 * Generate a unique ID (slug + random suffix)
 */
export const generateUniqueId = (prefix?: string): string => {
    const randomId = crypto.randomBytes(4).toString('hex');
    return prefix ? `${prefix}-${randomId}` : randomId;
};

/**
 * Parse array from string (newline or comma separated)
 */
export const parseArrayFromString = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);

    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
};

/**
 * Parse boolean from string
 */
export const parseBoolean = (value: string | boolean | undefined): boolean => {
    if (typeof value === 'boolean') return value;
    if (!value) return false;
    return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Parse number from string
 */
export const parseNumber = (value: string | number | undefined, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse JSON object from string or return existing object
 */
export const parseJSON = <T>(value: string | T | undefined, defaultValue: T): T => {
    if (!value) return defaultValue;
    if (typeof value === 'object') return value;

    if (typeof value !== 'string') return defaultValue;

    try {
        return JSON.parse(value) as T;
    } catch {
        return defaultValue;
    }
};

/**
 * Calculate pagination values
 */
export const calculatePagination = (
    page: number,
    pageSize: number,
    total: number
): { skip: number; limit: number; totalPages: number } => {
    const normalizedPage = Math.max(1, page);
    const normalizedPageSize = Math.min(Math.max(1, pageSize), 100);

    return {
        skip: (normalizedPage - 1) * normalizedPageSize,
        limit: normalizedPageSize,
        totalPages: Math.ceil(total / normalizedPageSize) || 1,
    };
};

/**
 * Omit specified keys from an object
 */
export const omitKeys = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
};

/**
 * Pick specified keys from an object
 */
export const pickKeys = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Remove empty values from an object
 */
export const removeEmptyValues = <T extends object>(obj: T): Partial<T> => {
    const result = {} as Partial<T>;

    Object.entries(obj).forEach(([key, value]) => {
        if (!isEmpty(value)) {
            (result as Record<string, unknown>)[key] = value;
        }
    });

    return result;
};

/**
 * Deep merge two objects
 */
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    const result = { ...target };

    Object.keys(source).forEach((key) => {
        const sourceValue = source[key as keyof T];
        const targetValue = result[key as keyof T];

        if (
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue)
        ) {
            (result as Record<string, unknown>)[key] = deepMerge(
                targetValue as object,
                sourceValue as object
            );
        } else if (sourceValue !== undefined) {
            (result as Record<string, unknown>)[key] = sourceValue;
        }
    });

    return result;
};

/**
 * Format date to ISO string (for API responses)
 */
export const formatDate = (date: Date | string | undefined): string | undefined => {
    if (!date) return undefined;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString();
};

/**
 * Mask sensitive data (email, phone)
 */
export const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;

    const maskedLocal = local.length > 2
        ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
        : local;

    return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone: string): string => {
    if (phone.length < 4) return phone;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
};
