/**
 * Application Constants
 * Centralized constants for the application
 */

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
    // Authentication
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',

    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',

    // Resource
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',

    // Server
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    // File Upload
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
} as const;

// User Roles
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    CLIENT: 'client',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User Statuses
export const USER_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof USER_STATUSES[keyof typeof USER_STATUSES];

// Permissions
export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_ANALYTICS: 'view_analytics',

    // Services
    VIEW_SERVICES: 'view_services',
    CREATE_SERVICES: 'create_services',
    EDIT_SERVICES: 'edit_services',
    DELETE_SERVICES: 'delete_services',

    // Portfolio
    VIEW_PORTFOLIO: 'view_portfolio',
    CREATE_PORTFOLIO: 'create_portfolio',
    EDIT_PORTFOLIO: 'edit_portfolio',
    DELETE_PORTFOLIO: 'delete_portfolio',

    // Technologies
    VIEW_TECHNOLOGIES: 'view_technologies',
    CREATE_TECHNOLOGIES: 'create_technologies',
    EDIT_TECHNOLOGIES: 'edit_technologies',
    DELETE_TECHNOLOGIES: 'delete_technologies',

    // Testimonials
    VIEW_TESTIMONIALS: 'view_testimonials',
    CREATE_TESTIMONIALS: 'create_testimonials',
    EDIT_TESTIMONIALS: 'edit_testimonials',
    DELETE_TESTIMONIALS: 'delete_testimonials',

    // Careers
    VIEW_CAREERS: 'view_careers',
    CREATE_CAREERS: 'create_careers',
    EDIT_CAREERS: 'edit_careers',
    DELETE_CAREERS: 'delete_careers',

    // CMS
    VIEW_CMS: 'view_cms',
    CREATE_CMS: 'create_cms',
    EDIT_CMS: 'edit_cms',
    DELETE_CMS: 'delete_cms',
    PUBLISH_CMS: 'publish_cms',

    // Users
    VIEW_USERS: 'view_users',
    CREATE_USERS: 'create_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    MANAGE_ROLES: 'manage_roles',

    // Blog
    VIEW_BLOGS: 'view_blogs',
    CREATE_BLOGS: 'create_blogs',
    EDIT_BLOGS: 'edit_blogs',
    DELETE_BLOGS: 'delete_blogs',
    PUBLISH_BLOGS: 'publish_blogs',

    // Settings
    VIEW_SETTINGS: 'view_settings',
    EDIT_SETTINGS: 'edit_settings',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role Permissions Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
    [USER_ROLES.ADMIN]: Object.values(PERMISSIONS).filter(
        (p) => p !== PERMISSIONS.MANAGE_ROLES
    ),
    [USER_ROLES.EDITOR]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_SERVICES,
        PERMISSIONS.EDIT_SERVICES,
        PERMISSIONS.VIEW_PORTFOLIO,
        PERMISSIONS.EDIT_PORTFOLIO,
        PERMISSIONS.VIEW_TECHNOLOGIES,
        PERMISSIONS.EDIT_TECHNOLOGIES,
        PERMISSIONS.VIEW_TESTIMONIALS,
        PERMISSIONS.EDIT_TESTIMONIALS,
        PERMISSIONS.VIEW_CAREERS,
        PERMISSIONS.EDIT_CAREERS,
        PERMISSIONS.VIEW_CMS,
        PERMISSIONS.EDIT_CMS,
        PERMISSIONS.VIEW_BLOGS,
        PERMISSIONS.EDIT_BLOGS,
    ],
    [USER_ROLES.CLIENT]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_SERVICES,
        PERMISSIONS.VIEW_PORTFOLIO,
    ],
};

// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;



// Blog Statuses
export const BLOG_STATUSES = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
} as const;

export type BlogStatus = typeof BLOG_STATUSES[keyof typeof BLOG_STATUSES];

// CMS Page Statuses
export const CMS_STATUSES = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
} as const;

export type CMSStatus = typeof CMS_STATUSES[keyof typeof CMS_STATUSES];

// Portfolio Statuses
export const PORTFOLIO_STATUSES = {
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    LIVE: 'Live',
    ARCHIVED: 'Archived',
} as const;

export type PortfolioStatus = typeof PORTFOLIO_STATUSES[keyof typeof PORTFOLIO_STATUSES];

// Career Job Types
export const JOB_TYPES = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    FREELANCE: 'Freelance',
} as const;

export type JobType = typeof JOB_TYPES[keyof typeof JOB_TYPES];

// Cookie Options
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
