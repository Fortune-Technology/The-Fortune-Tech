/**
 * Utility functions for common operations
 * Following DRY principle - reusable functions across the application
 */

import { PATTERNS } from './constants';

/**
 * Combines class names, filtering out falsy values
 * Useful for conditional className application
 * @example cn('btn', isActive && 'active', className) => 'btn active customClass'
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Formats a date string into a human-readable format
 * @param date - Date string or Date object
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(
    date: string | Date,
    locale = 'en-US',
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string {
    try {
        return new Date(date).toLocaleDateString(locale, options);
    } catch {
        return 'Invalid date';
    }
}

/**
 * Formats a date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
    try {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch {
        return 'Unknown';
    }
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 */
export function truncate(str: string, length: number, suffix = '...'): string {
    if (!str || str.length <= length) return str;
    return str.slice(0, length).trim() + suffix;
}

/**
 * Converts a string to a URL-friendly slug
 * @example slugify('Hello World!') => 'hello-world'
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 * @example titleCase('hello world') => 'Hello World'
 */
export function titleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Formats a number as currency
 * @param amount - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting
 */
export function formatCurrency(
    amount: number,
    currency = 'USD',
    locale = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Formats a large number with suffixes (K, M, B)
 * @example formatNumber(1500) => '1.5K'
 */
export function formatNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random string of specified length
 * @param length - Length of the random string
 */
export function randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch {
        return false;
    }
}

/**
 * Delays execution for specified milliseconds
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if code is running on the client side
 */
export function isClient(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Safely parses JSON with fallback
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

/**
 * Gets a value from localStorage with type safety
 * @param key - Storage key
 * @param fallback - Fallback value if key doesn't exist
 */
export function getLocalStorage<T>(key: string, fallback: T): T {
    if (!isClient()) return fallback;
    try {
        const item = window.localStorage.getItem(key);
        return item ? safeJsonParse(item, fallback) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Sets a value in localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
    if (!isClient()) return false;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/**
 * Removes a key from localStorage
 */
export function removeLocalStorage(key: string): boolean {
    if (!isClient()) return false;
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if a URL is external
 */
export function isExternalUrl(url: string): boolean {
    return PATTERNS.URL.test(url) && !url.startsWith(window.location.origin);
}

/**
 * Debounces a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttles a function
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 */
export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Groups an array of objects by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Removes duplicate values from an array
 */
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

/**
 * Shuffles an array randomly (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Sorts an array of objects by a key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Get the full URL for an image, handling both relative and absolute paths
 * @param path - The image path (can be relative from backend or absolute URL)
 * @param fallback - Fallback image if path is empty/undefined
 */
export function getImageUrl(path: string | undefined | null, fallback?: string): string {
    if (!path) {
        return fallback || '/images/placeholder.jpg';
    }
    // If it's already an absolute URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // If it starts with /uploads, prepend the backend URL
    if (path.startsWith('/uploads/')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        return `${apiUrl}${path}`;
    }
    // Local public folder images
    return path;
}
