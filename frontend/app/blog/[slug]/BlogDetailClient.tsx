'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '../../../components/ui/PageHeader';
import { FaClock, FaCalendarAlt, FaArrowLeft, FaUser, FaChevronDown, FaChevronUp, FaTags, FaSpinner } from 'react-icons/fa';
import { useGetBlogByIdQuery, useGetRelatedBlogsQuery } from '../../../lib/store/api/blogsApi';
import { getImageUrl } from '../../../lib/utils';
import type { BlogFAQItem } from '../../../lib/store/api/blogsApi';

interface BlogDetailClientProps {
    slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
    const { data: blogResponse, isLoading, isError } = useGetBlogByIdQuery(slug);
    const blog = blogResponse?.data;

    const { data: relatedResponse } = useGetRelatedBlogsQuery(blog?.id || blog?._id || '', {
        skip: !blog?.id && !blog?._id,
    });
    const relatedBlogs = relatedResponse?.data || [];

    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const formatDate = (date?: string) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    // JSON-LD Structured Data
    const jsonLd = blog ? {
        '@context': 'https://schema.org',
        '@type': blog.schemaType || 'BlogPosting',
        headline: blog.title,
        description: blog.metaDescription || blog.excerpt,
        image: blog.featuredImage ? getImageUrl(blog.featuredImage) : undefined,
        author: {
            '@type': 'Person',
            name: blog.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'The Fortune Tech',
            logo: {
                '@type': 'ImageObject',
                url: 'https://thefortunetech.com/logo.png',
            },
        },
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://thefortunetech.com/blog/${blog.slug}`,
        },
        wordCount: blog.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
        timeRequired: `PT${blog.readingTime}M`,
        keywords: blog.tags?.join(', '),
        articleSection: blog.category,
    } : null;

    // FAQ Schema
    const faqJsonLd = blog?.faqSection && blog.faqSection.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: blog.faqSection.map((faq: BlogFAQItem) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null;

    // Breadcrumb Schema
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thefortunetech.com' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://thefortunetech.com/blog' },
            ...(blog ? [{ '@type': 'ListItem', position: 3, name: blog.title, item: `https://thefortunetech.com/blog/${blog.slug}` }] : []),
        ],
    };

    if (isLoading) {
        return (
            <>
                <PageHeader title="Blog" subtitle="Loading article..." />
                <section className="section">
                    <div className="container">
                        <div className="blog-loading">
                            <FaSpinner className="spinner" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
                            <p>Loading article...</p>
                        </div>
                    </div>
                </section>
                <style jsx>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    if (isError || !blog) {
        return (
            <>
                <PageHeader title="Blog Post Not Found" subtitle="The article you're looking for doesn't exist or has been removed." />
                <section className="section">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <Link href="/blog" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                            <FaArrowLeft /> Back to Blog
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <section className="blog-detail-section">
            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className="container blog-detail-container">
                {/* Breadcrumb */}
                <nav className="blog-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="blog-breadcrumb-sep">/</span>
                    <Link href="/blog">Blog</Link>
                    <span className="blog-breadcrumb-sep">/</span>
                    <span className="blog-breadcrumb-current">{blog.title}</span>
                </nav>

                <article className="blog-article">
                    {/* Article Header */}
                    <header className="blog-article-header">
                        <span className="blog-article-category">{blog.category}</span>
                        <h1 className="blog-article-title">{blog.title}</h1>

                        <div className="blog-article-meta">
                            <span className="blog-article-meta-item">
                                <FaUser /> {blog.author}
                            </span>
                            <span className="blog-article-meta-item">
                                <FaCalendarAlt /> {formatDate(blog.publishedAt || blog.createdAt)}
                            </span>
                            <span className="blog-article-meta-item">
                                <FaClock /> {blog.readingTime} min read
                            </span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {blog.featuredImage && (
                        <div className="blog-article-featured-image">
                            <Image
                                src={getImageUrl(blog.featuredImage)}
                                alt={blog.title}
                                fill
                                unoptimized
                                priority
                                sizes="(max-width: 768px) 100vw, 800px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="blog-article-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-article-tags">
                            <FaTags className="blog-tags-icon" />
                            {blog.tags.map((tag, i) => (
                                <span key={i} className="blog-tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* FAQ Section */}
                    {blog.faqSection && blog.faqSection.length > 0 && (
                        <div className="blog-faq-section">
                            <h2 className="blog-faq-title">Frequently Asked Questions</h2>
                            {blog.faqSection.map((faq: BlogFAQItem, i: number) => (
                                <div key={i} className={`blog-faq-item ${openFAQ === i ? 'open' : ''}`}>
                                    <button
                                        className="blog-faq-question"
                                        onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                        aria-expanded={openFAQ === i}
                                    >
                                        <span>{faq.question}</span>
                                        {openFAQ === i ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    {openFAQ === i && (
                                        <div className="blog-faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Author Box */}
                    <div className="blog-author-box">
                        <div className="blog-author-avatar">
                            <FaUser />
                        </div>
                        <div className="blog-author-info">
                            <span className="blog-author-label">Written by</span>
                            <strong className="blog-author-name">{blog.author}</strong>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                    <div className="blog-related-section">
                        <h2 className="blog-related-title">Related Articles</h2>
                        <div className="blog-related-grid">
                            {relatedBlogs.map((related) => (
                                <Link
                                    key={related.id || related._id}
                                    href={`/blog/${related.slug}`}
                                    className="blog-related-card"
                                >
                                    <div className="blog-related-image">
                                        {related.featuredImage ? (
                                            <Image
                                                src={getImageUrl(related.featuredImage)}
                                                alt={related.title}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="blog-card-placeholder">
                                                <FaTags style={{ fontSize: '1.5rem' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="blog-related-content">
                                        <h3 className="blog-related-card-title">{related.title}</h3>
                                        <span className="blog-related-meta">
                                            <FaClock /> {related.readingTime} min read
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blog */}
                <div className="blog-back-link">
                    <Link href="/blog" className="blog-back-btn">
                        <FaArrowLeft /> Back to All Articles
                    </Link>
                </div>
            </div>
        </section>
    );
}
