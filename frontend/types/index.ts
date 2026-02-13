/**
 * Shared TypeScript type definitions
 * Centralized types ensure type safety across frontend and backend
 * Following Type Safety & Language Discipline principles
 */

// =============================================================================
// Website Configuration Types
// =============================================================================

export interface SiteConfig {
    name: string;
    description: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    socialMedia: SocialMedia;
}

export interface SocialMedia {
    linkedin?: string;
    facebook?: string;
    github?: string;
}

export interface NavigationLink {
    label: string;
    href: string;
}

// =============================================================================
// Service Types
// =============================================================================

export interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
    features: string[];
    benefits: string[];
    category?: string;
    image?: string;
    price?: {
        starting: number;
        currency: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export type ServiceCategory = 'development' | 'design' | 'consulting' | 'marketing' | 'other';

// =============================================================================
// Technology Types
// =============================================================================

export interface Technology {
    name: string;
    icon: string;
    category: TechnologyCategory;
    description?: string;
    level?: 'beginner' | 'intermediate' | 'expert';
}

export type TechnologyCategory =
    | 'frontend'
    | 'backend'
    | 'database'
    | 'cloud'
    | 'tools'
    | 'mobile'
    | 'devops';

export interface TechnologyGroup {
    category: TechnologyCategory;
    technologies: Technology[];
}

// =============================================================================
// Portfolio Types
// =============================================================================

export interface Portfolio {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: PortfolioCategory;
    image: string;
    images?: string[];
    technologies: string[];
    link?: string;
    github?: string;
    client?: string;
    duration?: string;
    status: 'completed' | 'in-progress' | 'planned';
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type PortfolioCategory =
    | 'web-app'
    | 'mobile-app'
    | 'e-commerce'
    | 'saas'
    | 'website'
    | 'other';

// =============================================================================
// Testimonial Types
// =============================================================================

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    image?: string;
    testimonial: string;
    rating: 1 | 2 | 3 | 4 | 5;
    featured?: boolean;
    createdAt?: string;
}

// =============================================================================
// Career Types
// =============================================================================

export interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    experience: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits?: string[];
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    status: 'open' | 'closed';
    postedAt: string;
    closingAt?: string;
}

// =============================================================================
// User Types
// =============================================================================

export interface User {
    _id?: string; // Backend raw _id (optional)
    id: string; // Transformed id (required)
    name?: string; // Flat name field
    firstName?: string;
    lastName?: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;

    // Nested objects from backend
    profile?: {
        bio?: string;
        phone?: string;
        location?: string;
        department?: string;
        position?: string;
        company?: string;
    };
    security?: {
        lastLogin?: string;
        twoFactorEnabled?: boolean;
    };
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'user' | 'client' | 'employee';

// =============================================================================
// CMS Types
// =============================================================================

export interface CMSContent {
    id: string;
    type: ContentType;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    author: string;
    status: 'draft' | 'published' | 'archived';
    featured?: boolean;
    tags?: string[];
    categories?: string[];
    seo?: SEOMetadata;
    publishedAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export type ContentType = 'page' | 'blog' | 'case-study' | 'documentation';

export interface SEOMetadata {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
}

// =============================================================================
// Form Types
// =============================================================================

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// =============================================================================
// Theme Types
// =============================================================================

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// =============================================================================
// Component Prop Types
// =============================================================================

export interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    hoverable?: boolean;
    onClick?: () => void;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Makes all properties optional recursively
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes specified keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specified keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extracts the type of an array element
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
