'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaGlobe, FaSpinner, FaFileAlt, FaCheck, FaTimes as FaTimesSolid } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetCMSPagesQuery,
    useGetCMSPageByIdQuery,
    useCreateCMSPageMutation,
    useUpdateCMSPageMutation,
    useDeleteCMSPageMutation,
    usePublishCMSPageMutation,
    useUnpublishCMSPageMutation,
} from '../../../lib/store/api/cmsApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';

interface CMSFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    type: string;
    status: string;
    featured: boolean;
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string;
    };
}

const initialFormData: CMSFormData = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    type: 'page',
    status: 'draft',
    featured: false,
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
};

const pageTypes = ['page', 'blog', 'case-study', 'documentation'];
const statuses = ['draft', 'published', 'archived'];

export default function CMSPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [viewingPageId, setViewingPageId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CMSFormData>(initialFormData);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: cmsResponse, isLoading, isError } = useGetCMSPagesQuery();
    const { data: pageDetailResponse } = useGetCMSPageByIdQuery(viewingPageId!, {
        skip: !viewingPageId
    });
    const [createPage, { isLoading: isCreating }] = useCreateCMSPageMutation();
    const [updatePage, { isLoading: isUpdating }] = useUpdateCMSPageMutation();
    const [deletePage, { isLoading: isDeleting }] = useDeleteCMSPageMutation();
    const [publishPage, { isLoading: isPublishing }] = usePublishCMSPageMutation();
    const [unpublishPage, { isLoading: isUnpublishing }] = useUnpublishCMSPageMutation();

    const pages = cmsResponse?.data || [];

    const filteredPages = pages.filter(page => {
        const matchesSearch = (page.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (page.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || page.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const generateSlug = (title: string) => {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleOpenModal = (page: any = null) => {
        if (page) {
            setEditingPageId(page._id);
            setFormData({
                title: page.title || '',
                slug: page.slug || '',
                content: page.content || '',
                excerpt: page.excerpt || '',
                type: page.type || 'page',
                status: page.status || 'draft',
                featured: page.featured || false,
                seo: {
                    metaTitle: page.seo?.metaTitle || '',
                    metaDescription: page.seo?.metaDescription || '',
                    keywords: page.seo?.keywords?.join(', ') || '',
                },
            });
        } else {
            setEditingPageId(null);
            setFormData(initialFormData);
        }
        setIsModalOpen(true);
    };

    const handleOpenDetail = (pageId: string) => {
        setViewingPageId(pageId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingPageId(null);
        setViewingPageId(null);
        setFormData(initialFormData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (name.startsWith('seo.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, [field]: val } as any,
            }));
        } else if (name === 'title' && !editingPageId) {
            // Auto-generate slug for new pages
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: generateSlug(value),
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            type: formData.type as 'page' | 'blog' | 'case-study' | 'documentation',
            status: formData.status as 'draft' | 'published' | 'archived',
            featured: formData.featured,
            seo: {
                metaTitle: formData.seo.metaTitle,
                metaDescription: formData.seo.metaDescription,
                keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k),
            },
        };

        try {
            if (editingPageId) {
                await updatePage({ id: editingPageId, data: dataToSend }).unwrap();
                dispatch(showSuccessNotification('Page updated successfully'));
            } else {
                await createPage(dataToSend).unwrap();
                dispatch(showSuccessNotification('Page created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save page'));
        }
    };

    const handleDelete = (id: string, title: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Page',
            message: 'This action will permanently delete this page. This cannot be undone.',
            itemName: title,
            onConfirm: async () => {
                try {
                    await deletePage(id).unwrap();
                    dispatch(showSuccessNotification('Page deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete page'));
                }
            }
        });
    };

    const handlePublishToggle = async (page: any) => {
        try {
            if (page.status === 'published') {
                await unpublishPage(page._id).unwrap();
                dispatch(showSuccessNotification('Page unpublished'));
            } else {
                await publishPage(page._id).unwrap();
                dispatch(showSuccessNotification('Page published successfully'));
            }
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to update page status'));
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="CMS Pages">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading pages...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="CMS Pages">
                <div className="admin-error">
                    <p>Failed to load pages. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="CMS Pages">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        <FaSearch style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} />
                    </div>

                    <select
                        className="form-input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '130px' }}
                    >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> Add Page
                    </button>
                </div>
            </div>

            {/* Pages Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Pages ({filteredPages.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPages.map((page, index) => (
                                <tr key={page._id || index}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="page-icon">
                                                <FaFileAlt />
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{page.title}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{page.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="type-badge">{page.type}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${page.status}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(page.updatedAt || '')}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(page._id)} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(page)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className={`table-action-btn ${page.status === 'published' ? 'unpublish' : 'publish'}`}
                                                onClick={() => handlePublishToggle(page)}
                                                title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                                                disabled={isPublishing || isUnpublishing}
                                            >
                                                {page.status === 'published' ? <FaTimesSolid /> : <FaGlobe />}
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(page._id, page.title)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPages.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No pages found
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
                    <div className="modal-content admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingPageId ? 'Edit Page' : 'Add Page'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slug</label>
                                    <input name="slug" className="form-input" value={formData.slug} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select name="type" className="form-input" value={formData.type} onChange={handleInputChange}>
                                        {pageTypes.map(type => (
                                            <option key={type} value={type}>{type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Excerpt</label>
                                    <textarea name="excerpt" className="form-input" value={formData.excerpt} onChange={handleInputChange} rows={2} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Content</label>
                                    <textarea name="content" className="form-input" value={formData.content} onChange={handleInputChange} required rows={8} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Featured</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                        <span>Feature this page</span>
                                    </div>
                                </div>

                                {/* SEO Section */}
                                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>SEO Settings</h4>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Title</label>
                                    <input name="seo.metaTitle" className="form-input" value={formData.seo.metaTitle} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Keywords (comma separated)</label>
                                    <input name="seo.keywords" className="form-input" value={formData.seo.keywords} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Meta Description</label>
                                    <textarea name="seo.metaDescription" className="form-input" value={formData.seo.metaDescription} onChange={handleInputChange} rows={2} />
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={handleCloseModals}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                                    {(isCreating || isUpdating) ? <FaSpinner className="spinner" /> : <FaSave />}
                                    {' '}Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail View Modal */}
            {isDetailOpen && pageDetailResponse?.data && (
                <div className="modal-overlay">
                    <div className="modal-content admin-card detail-view">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{pageDetailResponse.data.title}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div className="detail-meta">
                                <span className="type-badge">{pageDetailResponse.data.type}</span>
                                <span className={`status-badge ${pageDetailResponse.data.status}`}>{pageDetailResponse.data.status}</span>
                                <span style={{ color: 'var(--text-muted)' }}>/{pageDetailResponse.data.slug}</span>
                            </div>
                            {pageDetailResponse.data.excerpt && (
                                <div className="detail-section">
                                    <h5>Excerpt</h5>
                                    <p>{pageDetailResponse.data.excerpt}</p>
                                </div>
                            )}
                            <div className="detail-section">
                                <h5>Content</h5>
                                <div className="content-preview" dangerouslySetInnerHTML={{ __html: pageDetailResponse.data.content }} />
                            </div>
                            {pageDetailResponse.data.seo && (
                                <div className="detail-section seo-info">
                                    <h5>SEO Information</h5>
                                    <p><strong>Meta Title:</strong> {pageDetailResponse.data.seo.metaTitle || 'Not set'}</p>
                                    <p><strong>Meta Description:</strong> {pageDetailResponse.data.seo.metaDescription || 'Not set'}</p>
                                    <p><strong>Keywords:</strong> {pageDetailResponse.data.seo.keywords?.join(', ') || 'None'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
