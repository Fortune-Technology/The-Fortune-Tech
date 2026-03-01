'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '../../components/ui/PageHeader';
import { FaClock, FaCalendarAlt, FaArrowRight, FaSearch, FaTags, FaSpinner } from 'react-icons/fa';
import { useGetPublishedBlogsQuery } from '../../lib/store/api/blogsApi';
import { getImageUrl } from '../../lib/utils';

export default function BlogListingClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);

    const { data: blogsResponse, isLoading, isError } = useGetPublishedBlogsQuery({
        page,
        pageSize: 9,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
    });

    const blogs = blogsResponse?.data || [];
    const pagination = blogsResponse?.pagination;

    // Predefined categories + any custom categories from blog data
    const predefined = ['Business', 'Technology', 'Marketing', 'AI', 'Startups', 'Web Development', 'Cloud & DevOps', 'Design', 'SEO', 'Others'];
    const blogCategories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));
    const customCategories = blogCategories.filter(c => !predefined.includes(c));
    const categories = [...predefined.filter(c => c !== 'Others'), ...customCategories, 'Others'];

    const formatDate = (date?: string) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title="Our Blog"
                    subtitle="Insights, tutorials, and updates from our team of experts"
                />
                <section className="section">
                    <div className="container">
                        <div className="blog-loading">
                            <FaSpinner className="spinner cms-loading-spinner" />
                            <p>Loading articles...</p>
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

    if (isError) {
        return (
            <>
                <PageHeader
                    title="Our Blog"
                    subtitle="Insights, tutorials, and updates from our team of experts"
                />
                <section className="section">
                    <div className="container">
                        <div className="blog-error">
                            <p>Unable to load blog posts. Please try again later.</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Our Blog"
                subtitle="Insights, tutorials, and updates from our team of experts"
            />

            <section className="section">
                <div className="container">
                    {/* Show filters only when blogs exist or filters are active */}
                    {(blogs.length > 0 || searchQuery || selectedCategory) && (
                        <>
                            {/* Filters Bar */}
                            <div className="blog-filters">
                                <div className="blog-search-wrapper">
                                    <FaSearch className="blog-search-icon" />
                                    <input
                                        type="text"
                                        className="blog-search-input"
                                        placeholder="Search articles..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                    />
                                </div>
                                <div className="blog-category-filters">
                                    <button
                                        className={`blog-category-btn ${selectedCategory === '' ? 'active' : ''}`}
                                        onClick={() => { setSelectedCategory(''); setPage(1); }}
                                    >
                                        All
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            className={`blog-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                            onClick={() => { setSelectedCategory(cat); setPage(1); }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Blog Grid */}
                            <div className="blog-grid">
                                {blogs.map((blog) => (
                                    <Link
                                        key={blog.id || blog._id}
                                        href={`/blog/${blog.slug}`}
                                        className="blog-card"
                                    >
                                        <div className="blog-card-image">
                                            {blog.featuredImage ? (
                                                <Image
                                                    src={getImageUrl(blog.featuredImage)}
                                                    alt={blog.title}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="img-cover"
                                                />
                                            ) : (
                                                <div className="blog-card-placeholder">
                                                    <FaTags className="cms-loading-spinner" />
                                                </div>
                                            )}
                                            <span className="blog-card-category">{blog.category}</span>
                                        </div>
                                        <div className="blog-card-content">
                                            <h2 className="blog-card-title">{blog.title}</h2>
                                            <p className="blog-card-excerpt">{blog.excerpt}</p>
                                            <div className="blog-card-meta">
                                                <span className="blog-card-meta-item">
                                                    <FaCalendarAlt /> {formatDate(blog.publishedAt || blog.createdAt)}
                                                </span>
                                                <span className="blog-card-meta-item">
                                                    <FaClock /> {blog.readingTime} min read
                                                </span>
                                            </div>
                                            <span className="blog-card-read-more">
                                                Read More <FaArrowRight />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Filtered empty state — search/category returned no results */}
                            {blogs.length === 0 && !isLoading && (searchQuery || selectedCategory) && (
                                <div className="blog-empty">
                                    <h3>No articles found</h3>
                                    <p>Try adjusting your search or filter criteria.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="blog-pagination">
                                    <button
                                        className="blog-pagination-btn"
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span className="blog-pagination-info">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        className="blog-pagination-btn"
                                        disabled={page >= pagination.totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Truly empty state — no blogs in the system at all */}
                    {blogs.length === 0 && !isLoading && !searchQuery && !selectedCategory && (
                        <div className="blog-empty">
                            <h3>No articles found</h3>
                            <p>Check back later for new updates.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
