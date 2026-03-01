/**
 * Centralized constants for the application
 * Following DRY and KISS principles - all magic numbers and strings in one place
 */

// Animation Durations (milliseconds)
export const ANIMATION_DURATION = {
    FAST: 150,
    BASE: 300,
    SLOW: 500,
    SMOOTH: 600,
    COUNT_UP: 2000,
} as const;

// Responsive Breakpoints (pixels)
export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
    WIDE: 1536,
} as const;

// Scroll & Intersection Observer
export const SCROLL = {
    NAVBAR_THRESHOLD: 20,
    INTERSECTION_THRESHOLD: 0.2,
    TRIGGER_ONCE: true,
} as const;

// Application Routes
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    SERVICES: '/services',
    TECHNOLOGIES: '/technologies',
    PORTFOLIO: '/portfolio',
    CAREERS: '/careers',
    CONTACT: '/contact',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_SERVICES: '/admin/services',
    ADMIN_PORTFOLIO: '/admin/portfolio',
    ADMIN_TESTIMONIALS: '/admin/testimonials',
    ADMIN_CAREERS: '/admin/careers',
    ADMIN_CMS: '/admin/cms',
    ADMIN_TECHNOLOGIES: '/admin/technologies',
    ADMIN_SETTINGS: '/admin/settings',
} as const;

// Form Validation
export const VALIDATION = {
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    MESSAGE_MAX_LENGTH: 5000,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
} as const;

// Regex Patterns
export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-()]+$/,
    URL: /^https?:\/\/.+/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME: 'theme',
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
} as const;

// Theme Values
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

// API Configuration (Future Backend Integration)
export const API = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

// Image Configuration
export const IMAGE = {
    FORMATS: ['image/avif', 'image/webp'] as const,
    QUALITY: 85,
    SIZES: {
        THUMBNAIL: 150,
        SMALL: 300,
        MEDIUM: 768,
        LARGE: 1024,
        XLARGE: 1920,
    },
} as const;

// Social Media
export const SOCIAL_MEDIA = {
    LINKEDIN: 'linkedin',
    FACEBOOK: 'facebook',
    GITHUB: 'github',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    FORM_SUBMITTED: 'Form submitted successfully!',
    SAVED: 'Changes saved successfully',
    DELETED: 'Deleted successfully',
    COPIED: 'Copied to clipboard',
} as const;
