import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/blogs/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return {
                title: 'Blog Post Not Found | The Fortune Tech',
                description: 'The requested blog post could not be found.',
            };
        }

        const data = await res.json();
        const blog = data?.data;

        if (!blog) {
            return {
                title: 'Blog Post Not Found | The Fortune Tech',
                description: 'The requested blog post could not be found.',
            };
        }

        return {
            title: blog.metaTitle || `${blog.title} | The Fortune Tech Blog`,
            description: blog.metaDescription || blog.excerpt,
            keywords: blog.tags || [],
            openGraph: {
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.excerpt,
                type: 'article',
                url: `/blog/${blog.slug}`,
                images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
                publishedTime: blog.publishedAt,
                authors: [blog.author],
                tags: blog.tags || [],
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.excerpt,
                images: blog.featuredImage ? [blog.featuredImage] : [],
            },
            alternates: {
                canonical: `/blog/${blog.slug}`,
            },
        };
    } catch {
        return {
            title: 'Blog | The Fortune Tech',
            description: 'Read our latest tech insights and blog posts.',
        };
    }
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params;
    return <BlogDetailClient slug={slug} />;
}
