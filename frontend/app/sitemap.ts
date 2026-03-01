/**
 * Dynamic sitemap generation for SEO
 * Helps search engines discover and index all pages
 */

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thefortunetech.com';
    const currentDate = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/technologies`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/careers`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // Dynamic blog pages
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/blogs/published?pageSize=100`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (res.ok) {
            const data = await res.json();
            const blogs = data?.data || [];
            blogPages = blogs.map((blog: any) => ({
                url: `${baseUrl}/blog/${blog.slug}`,
                lastModified: new Date(blog.updatedAt || blog.publishedAt || currentDate),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
        }
    } catch {
        // Silently fail — blog entries will be omitted from sitemap
    }

    return [...staticPages, ...blogPages];
}

