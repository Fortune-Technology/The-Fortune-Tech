'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaStar, FaQuoteLeft, FaSpinner, FaChevronDown } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} from '../../../lib/store/api/testimonialsApi';
import { useGetPortfoliosQuery } from '../../../lib/store/api/portfolioApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import { getImageUrl } from '../../../lib/utils';
import ImageUpload from '../../../components/ui/ImageUpload';
import TestimonialDetailModal from '../../../components/admin/TestimonialDetailModal';

interface TestimonialFormData {
    name: string;
    role: string;
    company: string;
    industry: string;
    serviceProvided: string;
    projectType: string;
    content: string;
    rating: number;
    linkedin: string;
    website: string;
    verified: boolean;
    featured: boolean;
    portfolios: string[];
}

const initialFormData: TestimonialFormData = {
    name: '',
    role: '',
    company: '',
    industry: '',
    serviceProvided: '',
    projectType: '',
    content: '',
    rating: 5,
    linkedin: '',
    website: '',
    verified: false,
    featured: false,
    portfolios: [],
};

export default function TestimonialsPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
    const [viewingTestimonialId, setViewingTestimonialId] = useState<string | null>(null);
    const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
    const deleteConfirm = useDeleteConfirm();
    const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);

    // RTK Query hooks
    const { data: testimonialResponse, isLoading, isError } = useGetTestimonialsQuery();
    const { data: portfolioResponse } = useGetPortfoliosQuery();
    const { data: testimonialDetailResponse } = useGetTestimonialByIdQuery(viewingTestimonialId!, {
        skip: !viewingTestimonialId
    });
    const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
    const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
    const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

    const testimonials = testimonialResponse?.data || [];
    const portfolios = portfolioResponse?.data || [];

    // Build portfolio options for multi-select
    const portfolioOptions = useMemo(() =>
        portfolios.map(p => ({ id: p._id || p.id || '', label: p.title || p.slug || '' })).filter(p => p.id),
        [portfolios]
    );

    const filteredTestimonials = testimonials.filter(t =>
        (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (testimonial: any = null) => {
        if (testimonial) {
            setEditingTestimonialId(testimonial.id || testimonial._id);
            setFormData({
                name: testimonial.name || '',
                role: testimonial.role || '',
                company: testimonial.company || '',
                industry: testimonial.industry || '',
                serviceProvided: testimonial.serviceProvided || '',
                projectType: testimonial.projectType || '',
                content: testimonial.content || '',
                rating: testimonial.rating || 5,
                linkedin: testimonial.linkedin || '',
                website: testimonial.website || '',
                verified: testimonial.verified || false,
                featured: testimonial.featured || false,
                portfolios: testimonial.portfolios?.map((p: any) => typeof p === 'object' ? p._id || p.id : p) || [],
            });
            setExistingThumbnailUrl(testimonial.thumbnail || testimonial.avatar || null);
        } else {
            setEditingTestimonialId(null);
            setFormData(initialFormData);
            setExistingThumbnailUrl(null);
        }
        setThumbnailFile(null);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (testimonialId: string) => {
        setViewingTestimonialId(testimonialId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingTestimonialId(null);
        setViewingTestimonialId(null);
        setFormData(initialFormData);
        setThumbnailFile(null);
        setExistingThumbnailUrl(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        // Handle checkbox state correctly
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    // File handler replaced by ImageUpload component handler directly in JSX

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('company', formData.company);
        formDataToSend.append('industry', formData.industry);
        formDataToSend.append('serviceProvided', formData.serviceProvided);
        formDataToSend.append('projectType', formData.projectType);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('rating', formData.rating.toString());
        formDataToSend.append('linkedin', formData.linkedin);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('featured', String(formData.featured));
        formDataToSend.append('verified', String(formData.verified));

        // Folder path
        formDataToSend.append('folder', 'testimonials');

        if (thumbnailFile) {
            formDataToSend.append('thumbnail', thumbnailFile);
        }

        // Portfolio IDs as JSON array
        if (formData.portfolios.length > 0) {
            formDataToSend.append('portfolios', JSON.stringify(formData.portfolios));
        }

        try {
            if (editingTestimonialId) {
                await updateTestimonial({ id: editingTestimonialId, data: formDataToSend }).unwrap();
                dispatch(showSuccessNotification('Testimonial updated successfully'));
            } else {
                await createTestimonial(formDataToSend).unwrap();
                dispatch(showSuccessNotification('Testimonial created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save testimonial'));
        }
    };

    const handleDelete = (id: string, name: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Testimonial',
            message: 'This action will permanently delete this testimonial. This cannot be undone.',
            itemName: name,
            onConfirm: async () => {
                try {
                    await deleteTestimonial(id).unwrap();
                    dispatch(showSuccessNotification('Testimonial deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete testimonial'));
                }
            }
        });
    };

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar key={i} style={{ color: i < rating ? '#f59e0b' : 'var(--text-muted)', fontSize: '0.875rem' }} />
        ));
    };

    // Get testimonial image
    const getTestimonialImage = (testimonial: { thumbnail?: string; avatar?: string }) => {
        if (testimonial.avatar) {
            return getImageUrl(testimonial.avatar);
        }
        if (testimonial.thumbnail) {
            return getImageUrl(testimonial.thumbnail);
        }
        return null;
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Testimonials">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading testimonials...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Testimonials">
                <div className="admin-error">
                    <p>Failed to load testimonials. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Testimonials">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search testimonials..."
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

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> Add Testimonial
                    </button>
                </div>
            </div>

            {/* Testimonials Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Client Feedback ({filteredTestimonials.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>IMAGE</th>
                                <th>CLIENT</th>
                                <th>STATUS</th>
                                <th>RATING</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.map((testimonial, index) => {
                                const imageUrl = getTestimonialImage(testimonial);
                                return (
                                    <tr key={testimonial.id || testimonial._id || `testimonial-${index}`}>
                                        <td>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--glass-bg)' }}>
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={testimonial.name}
                                                        fill
                                                        unoptimized
                                                        sizes="50px"
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (!target.src.includes('/images/placeholder-avatar.jpg')) {
                                                                target.srcset = '';
                                                                target.src = '/images/placeholder-avatar.jpg';
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-start)', fontWeight: 600, fontSize: '1rem' }}>
                                                        {testimonial.name ? testimonial.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{testimonial.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{testimonial.role} at {testimonial.company}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {testimonial.featured && <span className="status-badge featured">FEATURED</span>}
                                                {testimonial.verified !== false && <span className="status-badge verified">VERIFIED</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="rating-stars">{renderStars(testimonial.rating || 5)}</div>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="table-action-btn" onClick={() => handleOpenDetail(testimonial.id || testimonial._id || '')} title="View">
                                                    <FaEye />
                                                </button>
                                                <button className="table-action-btn" onClick={() => handleOpenModal(testimonial)} title="Edit">
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="table-action-btn delete"
                                                    onClick={() => handleDelete(testimonial.id || testimonial._id || '', testimonial.name)}
                                                    title="Delete"
                                                    disabled={isDeleting}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredTestimonials.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No testimonials found
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
                    <div className="modal-content admin-card" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <input name="role" className="form-input" value={formData.role} onChange={handleInputChange} placeholder="e.g. CEO, CTO" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <input name="company" className="form-input" value={formData.company} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Industry</label>
                                    <input name="industry" className="form-input" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Healthcare, Fintech" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Service Provided</label>
                                    <input name="serviceProvided" className="form-input" value={formData.serviceProvided} onChange={handleInputChange} placeholder="e.g. Web Development" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <select name="rating" className="form-input" value={formData.rating} onChange={handleInputChange}>
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Testimonial Content *</label>
                                    <textarea name="content" className="form-input" value={formData.content} onChange={handleInputChange} required rows={5} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn URL</label>
                                    <input name="linkedin" className="form-input" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Website URL</label>
                                    <input name="website" className="form-input" value={formData.website} onChange={handleInputChange} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <ImageUpload
                                        label="Client Photo"
                                        value={thumbnailFile || existingThumbnailUrl}
                                        onChange={(file) => setThumbnailFile(file)}
                                        folderPath="testimonials"
                                        height={200}
                                    />
                                </div>
                                <div className="form-group">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input type="checkbox" name="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />
                                            <span>Featured (show on homepage)</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input type="checkbox" name="verified" checked={formData.verified} onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))} />
                                            <span>Verified</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Linked Portfolio Project</label>
                                    <select
                                        className="form-input"
                                        value={formData.portfolios[0] || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            portfolios: e.target.value ? [e.target.value] : []
                                        }))}
                                    >
                                        <option value="">— None —</option>
                                        {portfolioOptions.map(item => (
                                            <option key={item.id} value={item.id}>{item.label}</option>
                                        ))}
                                    </select>
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

            {/* Premium Testimonial Details Modal */}
            <TestimonialDetailModal
                isOpen={isDetailOpen}
                onClose={handleCloseModals}
                testimonial={testimonialDetailResponse?.data}
            />

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
