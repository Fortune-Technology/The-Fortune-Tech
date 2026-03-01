/**
 * Robots.txt configuration for SEO
 * Controls which parts of the site search engines can crawl
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thefortunetech.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: 'GPTBot', // OpenAI's web crawler
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                userAgent: 'Google-Extended', // Google's AI training crawler
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
