/**
 * Testimonial Routes
 */

import { Router } from 'express';
import { TestimonialController } from '../controllers';
import { validate, authenticate, requirePermissions, multiFields } from '../middlewares';
import { createTestimonialSchema, updateTestimonialSchema, testimonialIdSchema, testimonialQuerySchema } from '../dtos';
import { PERMISSIONS } from '../constants';

const router = Router();

// Define file fields for testimonials
const testimonialFileFields = [
    { name: 'avatar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
];

// Public routes
router.get('/', validate(testimonialQuerySchema, 'query'), TestimonialController.getAll);
router.get('/featured', TestimonialController.getFeatured);
router.get('/:id', validate(testimonialIdSchema, 'params'), TestimonialController.getById);

// Protected routes
router.post(
    '/',
    authenticate,
    requirePermissions(PERMISSIONS.CREATE_TESTIMONIALS),
    multiFields(testimonialFileFields),
    validate(createTestimonialSchema),
    TestimonialController.create
);

router.put(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.EDIT_TESTIMONIALS),
    multiFields(testimonialFileFields),
    validate(testimonialIdSchema, 'params'),
    validate(updateTestimonialSchema),
    TestimonialController.update
);

router.delete(
    '/:id',
    authenticate,
    requirePermissions(PERMISSIONS.DELETE_TESTIMONIALS),
    validate(testimonialIdSchema, 'params'),
    TestimonialController.delete
);

export default router;
