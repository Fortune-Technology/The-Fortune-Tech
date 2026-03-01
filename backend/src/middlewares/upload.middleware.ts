/**
 * Upload Middleware
 * File upload handling with Multer
 */

import { Request, Response, NextFunction } from 'express';
import { uploadImage, uploadDocument, uploadAny } from '../config/multer';
import { FileUploadError } from '../utils/errors';

/**
 * Handle single image upload
 */
export const singleImage = (fieldName: string = 'image') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadImage.single(fieldName)(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};

/**
 * Handle multiple image uploads
 */
export const multipleImages = (fieldName: string = 'images', maxCount: number = 10) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadImage.array(fieldName, maxCount)(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};

/**
 * Handle single document upload
 */
export const singleDocument = (fieldName: string = 'document') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadDocument.single(fieldName)(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};

/**
 * Handle multiple field uploads
 */
export const multiFields = (fields: { name: string; maxCount: number }[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadAny.fields(fields)(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};

/**
 * Handle any file upload (for general form-data parsing)
 */
export const anyFile = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadAny.any()(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};

/**
 * Handle form-data without files (just text fields)
 */
export const formDataOnly = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        uploadAny.none()(req, res, (err) => {
            if (err) {
                next(new FileUploadError(err.message));
                return;
            }
            next();
        });
    };
};
