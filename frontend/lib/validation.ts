/**
 * Form validation and input sanitization utilities
 * Following Secure by Design and Fail Fast principles
 */

import { PATTERNS, VALIDATION, ERROR_MESSAGES } from './constants';

/**
 * Validation result type
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || !email.trim()) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (email.length > VALIDATION.EMAIL_MAX_LENGTH) {
        return { isValid: false, error: `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters` };
    }

    if (!PATTERNS.EMAIL.test(email.trim())) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
    }

    return { isValid: true };
}

/**
 * Validates a phone number
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone || !phone.trim()) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const cleaned = phone.replace(/\s/g, '');

    if (cleaned.length < VALIDATION.PHONE_MIN_LENGTH || cleaned.length > VALIDATION.PHONE_MAX_LENGTH) {
        return {
            isValid: false,
            error: `Phone number must be between ${VALIDATION.PHONE_MIN_LENGTH} and ${VALIDATION.PHONE_MAX_LENGTH} digits`,
        };
    }

    if (!PATTERNS.PHONE.test(phone)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
    }

    return { isValid: true };
}

/**
 * Validates a password
 */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
    }

    if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
        return { isValid: false, error: `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters` };
    }

    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            isValid: false,
            error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        };
    }

    return { isValid: true };
}

/**
 * Validates a required field
 */
export function validateRequired(value: string, fieldName = 'This field'): ValidationResult {
    if (!value || !value.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
}

/**
 * Validates string length
 */
export function validateLength(
    value: string,
    min: number,
    max: number,
    fieldName = 'This field'
): ValidationResult {
    if (!value) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (value.length < min) {
        return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
    }

    if (value.length > max) {
        return { isValid: false, error: `${fieldName} must be less than ${max} characters` };
    }

    return { isValid: true };
}

/**
 * Validates a URL
 */
export function validateUrl(url: string): ValidationResult {
    if (!url || !url.trim()) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (!PATTERNS.URL.test(url)) {
        return { isValid: false, error: 'Please enter a valid URL (must start with http:// or https://)' };
    }

    return { isValid: true };
}

/**
 * Validates a slug (URL-friendly string)
 */
export function validateSlug(slug: string): ValidationResult {
    if (!slug || !slug.trim()) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (!PATTERNS.SLUG.test(slug)) {
        return { isValid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
    }

    return { isValid: true };
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 * Prevents XSS attacks
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .slice(0, 10000); // Prevent DoS with extremely long inputs
}

/**
 * Sanitizes HTML by removing script tags and dangerous attributes
 * Use this for rich text content
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
        .replace(/on\w+='[^']*'/gi, '') // Remove inline event handlers (single quotes)
        .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

/**
 * Validates contact form data
 */
export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export function validateContactForm(data: ContactFormData): Record<string, string> {
    const errors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateLength(data.name, VALIDATION.NAME_MIN_LENGTH, VALIDATION.NAME_MAX_LENGTH, 'Name');
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error || '';
    }

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error || '';
    }

    // Validate phone (optional)
    if (data.phone && data.phone.trim()) {
        const phoneValidation = validatePhone(data.phone);
        if (!phoneValidation.isValid) {
            errors.phone = phoneValidation.error || '';
        }
    }

    // Validate subject
    const subjectValidation = validateLength(data.subject, 3, 200, 'Subject');
    if (!subjectValidation.isValid) {
        errors.subject = subjectValidation.error || '';
    }

    // Validate message
    const messageValidation = validateLength(data.message, 10, VALIDATION.MESSAGE_MAX_LENGTH, 'Message');
    if (!messageValidation.isValid) {
        errors.message = messageValidation.error || '';
    }

    return errors;
}

/**
 * Validates login form data
 */
export interface LoginFormData {
    email: string;
    password: string;
}

export function validateLoginForm(data: LoginFormData): Record<string, string> {
    const errors: Record<string, string> = {};

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error || '';
    }

    const passwordValidation = validateRequired(data.password, 'Password');
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error || '';
    }

    return errors;
}

/**
 * Validates signup form data
 */
export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function validateSignupForm(data: SignupFormData): Record<string, string> {
    const errors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateLength(data.name, VALIDATION.NAME_MIN_LENGTH, VALIDATION.NAME_MAX_LENGTH, 'Name');
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error || '';
    }

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error || '';
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error || '';
    }

    // Validate confirm password
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

/**
 * Checks if an object has any validation errors
 */
export function hasErrors(errors: Record<string, string>): boolean {
    return Object.keys(errors).length > 0;
}

/**
 * Rate limiting helper - tracks attempts
 * Returns true if rate limit exceeded
 */
export function checkRateLimit(
    key: string,
    maxAttempts: number,
    windowMs: number
): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const storageKey = `rateLimit_${key}`;
        const stored = localStorage.getItem(storageKey);
        const now = Date.now();

        if (stored) {
            const { attempts, timestamp } = JSON.parse(stored);

            // Reset if window expired
            if (now - timestamp > windowMs) {
                localStorage.setItem(storageKey, JSON.stringify({ attempts: 1, timestamp: now }));
                return false;
            }

            // Check if limit exceeded
            if (attempts >= maxAttempts) {
                return true;
            }

            // Increment attempts
            localStorage.setItem(storageKey, JSON.stringify({ attempts: attempts + 1, timestamp }));
        } else {
            // First attempt
            localStorage.setItem(storageKey, JSON.stringify({ attempts: 1, timestamp: now }));
        }

        return false;
    } catch {
        return false; // Fail open if localStorage is unavailable
    }
}
