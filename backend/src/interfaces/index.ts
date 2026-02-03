/**
 * TypeScript Interfaces
 * Centralized type definitions matching frontend schemas exactly
 */

import { Request } from 'express';
import {
    UserRole,
    UserStatus,
    Permission,
    ExpertiseLevel,
    CMSStatus,
    PortfolioStatus,
    JobType,
} from '../constants';

// =============================================================================
// Common Types
// =============================================================================

export interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginationQuery {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

// =============================================================================
// Extended Request Type
// =============================================================================

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
        permissions: Permission[];
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

// =============================================================================
// SEO Types
// =============================================================================

export interface SEOData {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
}

// =============================================================================
// Service Types
// =============================================================================

export interface IService extends Timestamps {
    id: string;
    slug: string;
    title: string;
    tagline?: string;
    description: string;
    overview?: string;
    icon?: string;
    image?: string;
    features: string[];
    deliverables: string[];
    process: string[];
    techStack: string[];
    benefits: string[];
    idealFor: string[];
    cta?: string;
    seo: SEOData;
    pricingHint?: string;
    featured: boolean;
}

export interface CreateServiceDTO {
    title: string;
    tagline?: string;
    description: string;
    overview?: string;
    icon?: string;
    features?: string[];
    deliverables?: string[];
    process?: string[];
    techStack?: string[];
    benefits?: string[];
    idealFor?: string[];
    cta?: string;
    metaTitle?: string;
    metaDescription?: string;
    pricingHint?: string;
    featured?: boolean;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> { }

// =============================================================================
// Portfolio Types
// =============================================================================

export interface IPortfolioClient {
    name?: string;
    location?: string;
}

export interface IPortfolioLinks {
    live?: string;
    caseStudy?: string;
    github?: string;
}

export interface IPortfolio extends Timestamps {
    id: string;
    slug: string;
    title: string;
    category: string;
    industry?: string;
    client: IPortfolioClient;
    description: string;
    keyFeatures: string[];
    techStack: Record<string, string[]>;
    metrics: Record<string, string>;
    timeline?: string;
    status: PortfolioStatus;
    servicesProvided: string[];
    links: IPortfolioLinks;
    thumbnail?: string;
    featured: boolean;
}

export interface CreatePortfolioDTO {
    title: string;
    category: string;
    industry?: string;
    clientName?: string;
    clientLocation?: string;
    description: string;
    keyFeatures?: string[];
    techStack?: Record<string, string[]>;
    metrics?: Record<string, string>;
    timeline?: string;
    status?: string;
    servicesProvided?: string[];
    liveLink?: string;
    caseStudyLink?: string;
    githubLink?: string;
    featured?: boolean;
}

export interface UpdatePortfolioDTO extends Partial<CreatePortfolioDTO> { }

// =============================================================================
// Technology Types
// =============================================================================

export interface ITechnologyItem {
    name: string;
    icon?: string;
    expertiseLevel: ExpertiseLevel;
    experienceYears?: number;
    useCases: string[];
    featured: boolean;
}

export interface ITechnologyCategory extends Timestamps {
    id: string;
    category: string;
    slug: string;
    description?: string;
    items: ITechnologyItem[];
}

export interface CreateTechnologyCategoryDTO {
    category: string;
    description?: string;
    items?: ITechnologyItem[];
}

export interface UpdateTechnologyCategoryDTO extends Partial<CreateTechnologyCategoryDTO> { }

export interface CreateTechnologyItemDTO {
    name: string;
    icon?: string;
    expertiseLevel?: string;
    experienceYears?: number;
    useCases?: string[];
    featured?: boolean;
}

export interface UpdateTechnologyItemDTO extends Partial<CreateTechnologyItemDTO> { }

// =============================================================================
// Testimonial Types
// =============================================================================

export interface ITestimonialMetrics {
    [key: string]: string;
}

export interface ITestimonial extends Timestamps {
    id: string;
    slug: string;
    name: string;
    role?: string;
    company?: string;
    industry?: string;
    serviceProvided?: string;
    projectType?: string;
    rating: number;
    content: string;
    metrics: ITestimonialMetrics;
    avatar?: string;
    linkedin?: string;
    website?: string;
    verified: boolean;
    featured: boolean;
}

export interface CreateTestimonialDTO {
    name: string;
    role?: string;
    company?: string;
    industry?: string;
    serviceProvided?: string;
    projectType?: string;
    rating: number;
    content: string;
    metrics?: Record<string, string>;
    linkedin?: string;
    website?: string;
    verified?: boolean;
    featured?: boolean;
}

export interface UpdateTestimonialDTO extends Partial<CreateTestimonialDTO> { }

// =============================================================================
// Career Types
// =============================================================================

export interface ICareer extends Timestamps {
    id: string;
    title: string;
    department: string;
    location: string;
    experience?: string;
    type: JobType;
    description: string;
    requirements: string[];
    benefits: string[];
    applyLink?: string;
}

export interface CreateCareerDTO {
    title: string;
    department: string;
    location: string;
    experience?: string;
    type?: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    applyLink?: string;
}

export interface UpdateCareerDTO extends Partial<CreateCareerDTO> { }

// =============================================================================
// CMS Page Types
// =============================================================================

export interface ICMSPage extends Timestamps {
    id: string;
    slug: string;
    title: string;
    status: CMSStatus;
    metaTitle?: string;
    metaDescription?: string;
    content: string;
}

export interface CreateCMSPageDTO {
    title: string;
    slug?: string;
    status?: string;
    metaTitle?: string;
    metaDescription?: string;
    content: string;
}

export interface UpdateCMSPageDTO extends Partial<CreateCMSPageDTO> { }

// =============================================================================
// User Types
// =============================================================================

export interface IUserProfile {
    bio?: string;
    phone?: string;
    location?: string;
    department?: string;
    position?: string;
    company?: string;
}

export interface IUserPreferences {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
    };
    language?: string;
}

export interface IUserSecurity {
    twoFactorEnabled: boolean;
    lastLogin?: Date;
    loginAttempts: number;
    lockoutUntil?: Date;
    passwordChangedAt?: Date;
}

export interface IUserMetadata {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    permissions: Permission[];
    profile: IUserProfile;
    preferences: IUserPreferences;
    security: IUserSecurity;
    metadata: IUserMetadata;
}

export interface CreateUserDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    role?: string;
    status?: string;
    permissions?: string[];
    bio?: string;
    phone?: string;
    location?: string;
    department?: string;
    position?: string;
    company?: string;
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'password'>> {
    currentPassword?: string;
    newPassword?: string;
    password?: string; // For admin overrides
}

// =============================================================================
// Auth Types
// =============================================================================

export interface LoginDTO {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// =============================================================================
// Website Config Types
// =============================================================================

export interface ISiteSettings {
    name: string;
    tagline?: string;
    description?: string;
    url?: string;
    logo?: string;
    favicon?: string;
}

export interface ICompanySettings {
    legalName?: string;
    email?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    businessHours?: Record<string, string>;
}

export interface ISocialSettings {
    linkedin?: string;
    twitter?: string;
    github?: string;
    dribbble?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
}

export interface ISEOSettings {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
}

export interface IFeatureFlags {
    [key: string]: boolean;
}

export interface IWebsiteConfig {
    site: ISiteSettings;
    company: ICompanySettings;
    social: ISocialSettings;
    seo: ISEOSettings;
    features: IFeatureFlags;
}

export interface UpdateWebsiteConfigDTO {
    site?: Partial<ISiteSettings>;
    company?: Partial<ICompanySettings>;
    social?: Partial<ISocialSettings>;
    seo?: Partial<ISEOSettings>;
    features?: Partial<IFeatureFlags>;
}
