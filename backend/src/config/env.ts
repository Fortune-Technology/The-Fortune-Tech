/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    API_URL: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    COOKIE_SECRET: string;
    FRONTEND_URL: string;
    MAX_FILE_SIZE: number;
    UPLOAD_DIR: string;
    SENDGRID_API_KEY: string;
    SENDGRID_FROM_EMAIL: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const getEnvVarAsNumber = (key: string, defaultValue?: number): number => {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue === undefined) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
};

export const env: EnvConfig = {
    NODE_ENV: (getEnvVar('NODE_ENV', 'development') as EnvConfig['NODE_ENV']),
    PORT: getEnvVarAsNumber('PORT', 5000),
    API_URL: getEnvVar('API_URL', 'http://localhost:5000'),
    MONGODB_URI: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/the-fortune-tech'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
    JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '30d'),
    COOKIE_SECRET: getEnvVar('COOKIE_SECRET'),
    FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
    MAX_FILE_SIZE: getEnvVarAsNumber('MAX_FILE_SIZE', 5242880), // 5MB
    UPLOAD_DIR: getEnvVar('UPLOAD_DIR', 'public/uploads'),
    SENDGRID_API_KEY: getEnvVar('SENDGRID_API_KEY', ''),
    SENDGRID_FROM_EMAIL: getEnvVar('SENDGRID_FROM_EMAIL', 'noreply@thefortunetech.com'),
    RATE_LIMIT_WINDOW_MS: getEnvVarAsNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: getEnvVarAsNumber('RATE_LIMIT_MAX_REQUESTS', 100),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
