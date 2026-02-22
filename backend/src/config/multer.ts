/**
 * Multer Configuration
 * File upload handling for multipart/form-data
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from './env';
import { Request } from 'express';

// Helper to sanitize folder path
export const sanitizeFolder = (folder: string): string => {
    return folder.replace(/(\.\.(\/|\\|$))+/g, '').replace(/^\/+/, '');
};

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../', env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const subdirs = ['images', 'avatars', 'documents'];
subdirs.forEach((dir) => {
    const subPath = path.join(uploadDir, dir);
    if (!fs.existsSync(subPath)) {
        fs.mkdirSync(subPath, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        let subFolder = 'documents';

        const baseUrlParts = req.baseUrl ? req.baseUrl.split('/').filter(Boolean) : [];
        const moduleName = baseUrlParts.length > 0 ? baseUrlParts[baseUrlParts.length - 1] : '';

        // Check if a specific folder is requested in body or query
        if (req.body?.folder || req.query?.folder) {
            const requestedFolder = (req.body.folder || req.query.folder) as string;
            subFolder = sanitizeFolder(requestedFolder);
        } else if (moduleName && moduleName !== 'api' && moduleName !== 'v1') {
            subFolder = moduleName;
        } else if (file.mimetype.startsWith('image/')) {
            // Check if it's for avatar based on field name
            subFolder = file.fieldname === 'avatar' ? 'avatars' : 'images';
        }

        const dest = path.join(uploadDir, subFolder);

        // Ensure directory exists
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 50);
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

// File filter for images
const imageFileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`));
    }
};

// File filter for documents
const documentFileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`));
    }
};

// Generic any file filter (images + documents)
const anyFileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`));
    }
};

// Multer configurations for different use cases
export const uploadImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE,
    },
});

export const uploadDocument = multer({
    storage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE * 2, // Allow larger documents
    },
});

export const uploadAny = multer({
    storage,
    fileFilter: anyFileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE,
    },
});

// Get public URL for uploaded file
export const getFileUrl = (filename: string, subfolder: string = 'images'): string => {
    return `/uploads/${subfolder}/${filename}`;
};

// Delete file helper
export const deleteFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(uploadDir, filePath);
        fs.unlink(fullPath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
