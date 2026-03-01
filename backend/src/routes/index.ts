/**
 * Routes Index
 * Central route configuration
 */

import { Router, Response } from 'express';
import authRoutes from './auth.routes';
import serviceRoutes from './service.routes';
import portfolioRoutes from './portfolio.routes';
import technologyRoutes from './technology.routes';
import testimonialRoutes from './testimonial.routes';
import careerRoutes from './career.routes';
import cmsRoutes from './cms.routes';
import userRoutes from './user.routes';
import settingsRoutes from './settings.routes';
import blogRoutes from './blog.routes';
import profileRoutes from './profile.routes';

const router = Router();

// Health check
router.get('/health', (_, res: Response) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        },
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/technologies', technologyRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/careers', careerRoutes);
router.use('/cms', cmsRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);
router.use('/blogs', blogRoutes);
router.use('/profile', profileRoutes);

export default router;
