'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
    FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes,
    FaEye, FaSpinner, FaNewspaper, FaClock, FaCalendarAlt
} from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetBlogsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} from '../../../lib/store/api/blogsApi';
import type { Blog, BlogFAQItem } from '../../../lib/store/api/blogsApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import { getImageUrl } from '../../../lib/utils';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../../components/ui/RichTextEditor'), { ssr: false });

// Predefined blog categories
const DEFAULT_CATEGORIES = [
    'Business',
    'Technology',
    'Marketing',
    'AI',
    'Startups',
    'Web Development',
    'Cloud & DevOps',
    'Design',
    'SEO',
    'Others',
];

interface BlogFormData {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    metaTitle: string;
    metaDescription: string;
    author: string;
    status: 'draft' | 'published';
    schemaType: string;
    faqSection: BlogFAQItem[];
}

const initialFormData: BlogFormData = {
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    author: '',
    status: 'draft',
    schemaType: 'BlogPosting',
    faqSection: [],
};

export default function BlogPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState<BlogFormData>(initialFormData);
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const deleteConfirm = useDeleteConfirm();

    // Dynamic category management
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Merge default + custom categories
    const allCategories = [...DEFAULT_CATEGORIES.filter(c => c !== 'Others'), ...customCategories, 'Others'];

    // RTK Query hooks
    const { data: blogsResponse, isLoading, isError } = useGetBlogsQuery({
        search: searchQuery || undefined,
        status: statusFilter || undefined,
    });
    const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

    const blogs = blogsResponse?.data || [];

    const handleOpenModal = (blog: Blog | null = null) => {
        if (blog) {
            setEditingBlogId(blog.id || blog._id || null);
            setFormData({
                title: blog.title || '',
                excerpt: blog.excerpt || '',
                content: blog.content || '',
                category: blog.category || '',
                tags: (blog.tags || []).join(', '),
                metaTitle: blog.metaTitle || '',
                metaDescription: blog.metaDescription || '',
                author: blog.author || '',
                status: blog.status || 'draft',
                schemaType: blog.schemaType || 'BlogPosting',
                faqSection: blog.faqSection || [],
            });
            // If the blog has a category not in defaults/custom, add it
            if (blog.category && !allCategories.includes(blog.category)) {
                setCustomCategories(prev => [...prev, blog.category]);
            }
        } else {
            setEditingBlogId(null);
            setFormData(initialFormData);
        }
        setFeaturedImageFile(null);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (blog: Blog) => {
        setViewingBlog(blog);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingBlogId(null);
        setViewingBlog(null);
        setFormData(initialFormData);
        setFeaturedImageFile(null);
        setShowAddCategory(false);
        setNewCategoryName('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFeaturedImageFile(e.target.files[0]);
        }
    };

    // Add custom category
    const handleAddCustomCategory = () => {
        const trimmed = newCategoryName.trim();
        if (trimmed && !allCategories.includes(trimmed)) {
            setCustomCategories(prev => [...prev, trimmed]);
            setFormData(prev => ({ ...prev, category: trimmed }));
            setNewCategoryName('');
            setShowAddCategory(false);
        }
    };

    // FAQ Handlers
    const handleAddFAQ = () => {
        setFormData(prev => ({
            ...prev,
            faqSection: [...prev.faqSection, { question: '', answer: '' }],
        }));
    };

    const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
        setFormData(prev => {
            const faq = [...prev.faqSection];
            faq[index] = { ...faq[index], [field]: value };
            return { ...prev, faqSection: faq };
        });
    };

    const handleRemoveFAQ = (index: number) => {
        setFormData(prev => ({
            ...prev,
            faqSection: prev.faqSection.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('excerpt', formData.excerpt);
        fd.append('content', formData.content);
        fd.append('category', formData.category);
        fd.append('tags', formData.tags);
        fd.append('metaTitle', formData.metaTitle);
        fd.append('metaDescription', formData.metaDescription);
        fd.append('author', formData.author);
        fd.append('status', formData.status);
        fd.append('schemaType', formData.schemaType);

        if (formData.faqSection.length > 0) {
            fd.append('faqSection', JSON.stringify(formData.faqSection.filter(f => f.question && f.answer)));
        }

        if (featuredImageFile) {
            fd.append('featuredImage', featuredImageFile);
        }

        try {
            if (editingBlogId) {
                await updateBlog({ id: editingBlogId, data: fd }).unwrap();
                dispatch(showSuccessNotification('Blog post updated successfully'));
            } else {
                await createBlog(fd).unwrap();
                dispatch(showSuccessNotification('Blog post created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.error?.message || err?.data?.message || 'Failed to save blog post'));
        }
    };

    const handleDelete = (id: string, title: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Blog Post',
            message: 'This action will permanently delete this blog post. This cannot be undone.',
            itemName: title,
            onConfirm: async () => {
                try {
                    await deleteBlog(id).unwrap();
                    dispatch(showSuccessNotification('Blog post deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete blog post'));
                }
            }
        });
    };

    const formatDate = (date?: string) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Blog Posts">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading blog posts...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Blog Posts">
                <div className="admin-error">
                    <p>Failed to load blog posts. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Blog Posts">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search blog posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        <FaSearch style={{
                            position: 'absolute', left: '1rem', top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--text-muted)'
                        }} />
                    </div>

                    <select
                        className="form-input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '140px' }}
                    >
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> New Blog Post
                    </button>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Blog Posts ({blogs.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => (
                                <tr key={blog.id || blog._id || `blog-${index}`}>
                                    <td>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '8px',
                                            overflow: 'hidden', position: 'relative', backgroundColor: 'var(--glass-bg)'
                                        }}>
                                            {blog.featuredImage ? (
                                                <Image
                                                    src={getImageUrl(blog.featuredImage)}
                                                    alt={blog.title}
                                                    fill
                                                    unoptimized
                                                    sizes="50px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%', height: '100%', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--text-muted)', fontSize: '1rem'
                                                }}>
                                                    <FaNewspaper />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{blog.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaClock style={{ fontSize: '0.65rem' }} /> {blog.readingTime} min read
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.8rem', padding: '0.2rem 0.6rem',
                                            borderRadius: '12px', backgroundColor: 'var(--glass-bg)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${blog.status === 'published' ? 'active' : 'inactive'}`}>
                                            {blog.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {blog.author}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <FaCalendarAlt style={{ fontSize: '0.65rem' }} />
                                            {formatDate(blog.publishedAt || blog.createdAt)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(blog)} title="View Detail">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(blog)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(blog.id || blog._id || '', blog.title)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {blogs.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No blog posts found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content admin-card" data-lenis-prevent style={{ maxWidth: '900px' }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingBlogId ? 'Edit Blog Post' : 'New Blog Post'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                {/* Title */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Title *</label>
                                    <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>

                                {/* Excerpt */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Excerpt *</label>
                                    <textarea name="excerpt" className="form-input" value={formData.excerpt} onChange={handleInputChange} required rows={2} maxLength={500} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formData.excerpt.length}/500</span>
                                </div>

                                {/* Content - Rich Text Editor */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Content *</label>
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        height={350}
                                        placeholder="Write your blog post content..."
                                    />
                                </div>

                                {/* Category (Dropdown + Add Category) & Author */}
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Category *</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddCategory(!showAddCategory)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                                color: 'var(--accent-start)', background: 'none', border: 'none',
                                                padding: 0, fontFamily: 'inherit',
                                            }}
                                            title="Add a new category"
                                        >
                                            <FaPlus style={{ fontSize: '0.6rem' }} /> Add Category
                                        </button>
                                    </label>

                                    {showAddCategory && (
                                        <div style={{
                                            display: 'flex', gap: '0.5rem', marginBottom: '0.5rem',
                                            animation: 'faqSlideDown 0.2s ease-out',
                                        }}>
                                            <input
                                                className="form-input"
                                                placeholder="New category name..."
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCategory(); } }}
                                                style={{ flex: 1 }}
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleAddCustomCategory}
                                                disabled={!newCategoryName.trim()}
                                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}
                                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}

                                    <select
                                        name="category"
                                        className="form-input"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {allCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Author *</label>
                                    <input name="author" className="form-input" value={formData.author} onChange={handleInputChange} required />
                                </div>

                                {/* Tags & Status */}
                                <div className="form-group">
                                    <label className="form-label">Tags</label>
                                    <input name="tags" className="form-input" value={formData.tags} onChange={handleInputChange} placeholder="e.g., react, nextjs, web development" />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comma-separated</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                {/* Featured Image */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Featured Image</label>
                                    <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                                </div>

                                {/* FAQ Section */}
                                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        FAQ Section
                                        <button type="button" className="btn btn-outline" onClick={handleAddFAQ} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                                            <FaPlus style={{ marginRight: '0.3rem' }} /> Add FAQ
                                        </button>
                                    </h4>
                                    {formData.faqSection.map((faq, idx) => (
                                        <div key={idx} style={{
                                            padding: '1rem', marginBottom: '0.75rem', borderRadius: '8px',
                                            border: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>FAQ #{idx + 1}</span>
                                                <button type="button" className="table-action-btn delete" onClick={() => handleRemoveFAQ(idx)} style={{ fontSize: '0.75rem' }}>
                                                    <FaTimes />
                                                </button>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                                                <input
                                                    className="form-input"
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={(e) => handleUpdateFAQ(idx, 'question', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <textarea
                                                    className="form-input"
                                                    placeholder="Answer"
                                                    value={faq.answer}
                                                    onChange={(e) => handleUpdateFAQ(idx, 'answer', e.target.value)}
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* SEO Settings */}
                                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>SEO Settings</h4>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Title</label>
                                    <input name="metaTitle" className="form-input" value={formData.metaTitle} onChange={handleInputChange} maxLength={70} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formData.metaTitle.length}/70</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Description</label>
                                    <textarea name="metaDescription" className="form-input" value={formData.metaDescription} onChange={handleInputChange} rows={2} maxLength={160} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formData.metaDescription.length}/160</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={handleCloseModals}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                                    {(isCreating || isUpdating) ? <FaSpinner className="spinner" /> : <FaSave />}
                                    {' '}Save Blog Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blog Detail Modal — Left-aligned */}
            {isDetailOpen && viewingBlog && (
                <div className="modal-overlay">
                    <div className="modal-content admin-card" data-lenis-prevent style={{ maxWidth: '800px' }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Blog Post Details</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'left' }}>
                            {/* Title & Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, textAlign: 'left' }}>
                                    {viewingBlog.title}
                                </h2>
                                <span className={`status-badge ${viewingBlog.status === 'published' ? 'active' : 'inactive'}`} style={{ marginLeft: '1rem', flexShrink: 0 }}>
                                    {viewingBlog.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                            </div>

                            {/* Meta Info */}
                            <div style={{
                                display: 'flex', gap: '1rem', flexWrap: 'wrap',
                                marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)',
                                justifyContent: 'flex-start',
                            }}>
                                <span>By <strong>{viewingBlog.author}</strong></span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <FaCalendarAlt /> {formatDate(viewingBlog.publishedAt || viewingBlog.createdAt)}
                                </span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <FaClock /> {viewingBlog.readingTime} min read
                                </span>
                                <span>•</span>
                                <span>{viewingBlog.category}</span>
                            </div>

                            {/* Featured Image */}
                            {viewingBlog.featuredImage && (
                                <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', position: 'relative', width: '100%', height: '300px' }}>
                                    <Image
                                        src={getImageUrl(viewingBlog.featuredImage)}
                                        alt={viewingBlog.title}
                                        fill
                                        unoptimized
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            <div style={{
                                padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
                                backgroundColor: 'var(--glass-bg)', borderLeft: '4px solid var(--primary)',
                                fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-secondary)',
                                textAlign: 'left',
                            }}>
                                {viewingBlog.excerpt}
                            </div>

                            {/* Content */}
                            <div
                                className="blog-content-preview"
                                dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
                                style={{ marginBottom: '1.5rem', lineHeight: 1.8, textAlign: 'left' }}
                            />

                            {/* Tags */}
                            {viewingBlog.tags && viewingBlog.tags.length > 0 && (
                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Tags:</strong>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {viewingBlog.tags.map((tag, i) => (
                                            <span key={i} style={{
                                                padding: '0.2rem 0.6rem', borderRadius: '12px',
                                                backgroundColor: 'var(--glass-bg)', fontSize: '0.8rem',
                                                color: 'var(--primary)', border: '1px solid var(--glass-border)'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQ Section */}
                            {viewingBlog.faqSection && viewingBlog.faqSection.length > 0 && (
                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>FAQ Section:</strong>
                                    {viewingBlog.faqSection.map((faq, i) => (
                                        <div key={i} style={{
                                            padding: '0.75rem 1rem', marginBottom: '0.5rem',
                                            borderRadius: '8px', backgroundColor: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)', textAlign: 'left',
                                        }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                Q: {faq.question}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                A: {faq.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* SEO Info */}
                            {(viewingBlog.metaTitle || viewingBlog.metaDescription) && (
                                <div style={{
                                    padding: '1rem', borderRadius: '8px',
                                    backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                                    textAlign: 'left',
                                }}>
                                    <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>SEO Preview:</strong>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a0dab', marginBottom: '0.2rem', textAlign: 'left' }}>
                                        {viewingBlog.metaTitle || viewingBlog.title}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#006621', textAlign: 'left' }}>
                                        thefortunetech.com/blog/{viewingBlog.slug}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                                        {viewingBlog.metaDescription || viewingBlog.excerpt}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button className="btn btn-outline" onClick={handleCloseModals}>Close</button>
                                <button className="btn btn-primary" onClick={() => { handleCloseModals(); handleOpenModal(viewingBlog); }}>
                                    <FaEdit /> Edit Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
