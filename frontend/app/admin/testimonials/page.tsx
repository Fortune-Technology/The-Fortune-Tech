'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaStar, FaQuoteLeft, FaSpinner } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} from '../../../lib/store/api/testimonialsApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';

interface TestimonialFormData {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    featured: boolean;
}

const initialFormData: TestimonialFormData = {
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    featured: false,
};

export default function TestimonialsPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
    const [viewingTestimonialId, setViewingTestimonialId] = useState<string | null>(null);
    const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: testimonialsResponse, isLoading, isError } = useGetTestimonialsQuery();
    const { data: testimonialDetailResponse } = useGetTestimonialByIdQuery(viewingTestimonialId!, {
        skip: !viewingTestimonialId
    });
    const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
    const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
    const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

    const testimonials = testimonialsResponse?.data || [];

    const filteredTestimonials = testimonials.filter(t =>
        (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (testimonial: any = null) => {
        if (testimonial) {
            setEditingTestimonialId(testimonial._id);
            setFormData({
                name: testimonial.name || '',
                role: testimonial.role || '',
                company: testimonial.company || '',
                content: testimonial.content || '',
                rating: testimonial.rating || 5,
                featured: testimonial.featured || false,
            });
        } else {
            setEditingTestimonialId(null);
            setFormData(initialFormData);
        }
        setAvatarFile(null);
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
        setAvatarFile(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('company', formData.company);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('rating', formData.rating.toString());
        formDataToSend.append('featured', String(formData.featured));

        if (avatarFile) {
            formDataToSend.append('avatar', avatarFile);
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
                                <th>CLIENT</th>
                                <th>STATUS</th>
                                <th>RATING</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.map((testimonial, index) => (
                                <tr key={testimonial._id || `testimonial-${index}`}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="testimonial-avatar">
                                                {testimonial.name ? testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{testimonial.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{testimonial.role} at {testimonial.company}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {testimonial.featured && <span className="status-badge featured">FEATURED</span>}
                                            <span className="status-badge verified">VERIFIED</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="rating-stars">{renderStars(testimonial.rating || 5)}</div>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(testimonial._id)} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(testimonial)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(testimonial._id, testimonial.name)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTestimonials.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
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
                                    <label className="form-label">Name</label>
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
                                    <label className="form-label">Rating</label>
                                    <select name="rating" className="form-input" value={formData.rating} onChange={handleInputChange}>
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Testimonial Content</label>
                                    <textarea name="content" className="form-input" value={formData.content} onChange={handleInputChange} required rows={5} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Avatar</label>
                                    <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Featured</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                        <span>Show on homepage</span>
                                    </div>
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
            {isDetailOpen && testimonialDetailResponse?.data && (
                <div className="modal-overlay">
                    <div className="modal-content admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Testimonial Details</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div className="detail-header">
                                <div className="detail-avatar">
                                    {testimonialDetailResponse.data.avatar ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${testimonialDetailResponse.data.avatar.startsWith('/') ? '' : '/'}${testimonialDetailResponse.data.avatar}`}
                                            alt={testimonialDetailResponse.data.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        testimonialDetailResponse.data.name ? testimonialDetailResponse.data.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'
                                    )}
                                </div>
                                <div>
                                    <h4>{testimonialDetailResponse.data.name || 'Unknown'}</h4>
                                    <p>{testimonialDetailResponse.data.role || ''} at {testimonialDetailResponse.data.company || 'N/A'}</p>
                                    <div style={{ marginTop: '0.5rem' }}>{renderStars(testimonialDetailResponse.data.rating || 5)}</div>
                                </div>
                            </div>
                            <div className="detail-content">
                                <FaQuoteLeft style={{ fontSize: '1.5rem', color: 'var(--accent-start)', marginBottom: '1rem' }} />
                                <p>{testimonialDetailResponse.data.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
