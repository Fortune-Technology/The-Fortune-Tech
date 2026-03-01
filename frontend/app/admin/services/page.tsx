'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaChevronRight, FaSpinner } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from '../../../lib/store/api/servicesApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import { getImageUrl } from '../../../lib/utils';
import Image from 'next/image';
import ImageUpload from '../../../components/ui/ImageUpload';
import ServiceDetailModal from '../../../components/admin/ServiceDetailModal';

interface ServiceFormData {
    title: string;
    tagline: string;
    description: string;
    overview: string;
    icon: string;
    image: string;
    thumbnail: string;
    features: string;
    deliverables: string;
    process: string;
    techStack: string;
    benefits: string;
    idealFor: string;
    cta: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
    };
    featured: boolean;
}

const initialFormData: ServiceFormData = {
    title: '',
    tagline: '',
    description: '',
    overview: '',
    icon: 'FaBox',
    image: '',
    thumbnail: '',
    features: '',
    deliverables: '',
    process: '',
    techStack: '',
    benefits: '',
    idealFor: '',
    cta: 'Learn More',
    seo: { metaTitle: '', metaDescription: '' },
    featured: false,
};

export default function ServicesPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [viewingServiceId, setViewingServiceId] = useState<string | null>(null);
    const [viewingService, setViewingService] = useState<any>(null);
    const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [existingIconUrl, setExistingIconUrl] = useState<string | null>(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: servicesResponse, isLoading, isError, error } = useGetServicesQuery();
    const { data: serviceDetailResponse } = useGetServiceByIdQuery(viewingServiceId!, {
        skip: !viewingServiceId
    });
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const services = servicesResponse?.data || [];

    const filteredServices = services.filter(service =>
        (service.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (service: any = null) => {
        if (service) {
            setEditingServiceId(service.id || service._id);
            setFormData({
                title: service.title || '',
                tagline: service.tagline || '',
                description: service.description || '',
                overview: service.overview || '',
                icon: service.icon || 'FaBox',
                image: service.image || '',
                thumbnail: service.thumbnail || '',
                features: service.features?.join('\n') || '',
                deliverables: service.deliverables?.join('\n') || '',
                process: service.process?.join('\n') || '',
                techStack: service.techStack?.join('\n') || '',
                benefits: service.benefits?.join('\n') || '',
                idealFor: service.idealFor?.join('\n') || '',
                cta: service.cta || 'Learn More',
                seo: {
                    metaTitle: service.seo?.metaTitle || '',
                    metaDescription: service.seo?.metaDescription || '',
                },
                featured: service.featured || false,
            });
            setExistingIconUrl(service.image || service.icon || null);
            setExistingThumbnailUrl(service.thumbnail || null);
        } else {
            setEditingServiceId(null);
            setFormData(initialFormData);
            setExistingIconUrl(null);
            setExistingThumbnailUrl(null);
        }
        setIconFile(null);
        setThumbnailFile(null);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (serviceId: string) => {
        setViewingServiceId(serviceId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingServiceId(null);
        setViewingServiceId(null);
        setViewingService(null);
        setFormData(initialFormData);
        setFormData(initialFormData);
        setIconFile(null);
        setThumbnailFile(null);
        setExistingIconUrl(null);
        setExistingThumbnailUrl(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (name.startsWith('seo.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, [field]: val } as any
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    // File handlers replaced by ImageUpload component handlers directly in JSX

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Build FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('tagline', formData.tagline);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('overview', String(formData.overview));

        // Folder path for organization
        formDataToSend.append('folder', `serviceicon`);

        if (iconFile) {
            formDataToSend.append('image', iconFile);
        }
        if (thumbnailFile) {
            formDataToSend.append('thumbnail', thumbnailFile);
        }
        formDataToSend.append('cta', formData.cta);
        formDataToSend.append('featured', String(formData.featured));

        // Arrays
        const features = formData.features.split('\n').filter(i => i.trim());
        const deliverables = formData.deliverables.split('\n').filter(i => i.trim());
        const process = formData.process.split('\n').filter(i => i.trim());
        const techStack = formData.techStack.split('\n').filter(i => i.trim());
        const benefits = formData.benefits.split('\n').filter(i => i.trim());
        const idealFor = formData.idealFor.split('\n').filter(i => i.trim());

        features.forEach(item => formDataToSend.append('features[]', item));
        deliverables.forEach(item => formDataToSend.append('deliverables[]', item));
        process.forEach(item => formDataToSend.append('process[]', item));
        techStack.forEach(item => formDataToSend.append('techStack[]', item));
        benefits.forEach(item => formDataToSend.append('benefits[]', item));
        idealFor.forEach(item => formDataToSend.append('idealFor[]', item));

        // SEO
        formDataToSend.append('seo[metaTitle]', formData.seo.metaTitle);
        formDataToSend.append('seo[metaDescription]', formData.seo.metaDescription);

        try {
            if (editingServiceId) {
                await updateService({ id: editingServiceId, data: formDataToSend }).unwrap();
                dispatch(showSuccessNotification('Service updated successfully'));
            } else {
                await createService(formDataToSend).unwrap();
                dispatch(showSuccessNotification('Service created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.error?.message || err?.data?.message || 'Failed to save service'));
        }
    };

    const handleDelete = (id: string, title: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Service',
            message: 'This action will permanently delete this service from the system. This cannot be undone.',
            itemName: title,
            onConfirm: async () => {
                try {
                    await deleteService(id).unwrap();
                    dispatch(showSuccessNotification('Service deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.error?.message || err?.data?.message || 'Failed to delete service'));
                }
            }
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Services">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading services...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Services">
                <div className="admin-error">
                    <p>Failed to load services. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Services">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search services..."
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
                        <FaPlus /> Add Service
                    </button>
                </div>
            </div>

            {/* Services Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Services ({filteredServices.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Image</th>
                                <th>Service</th>
                                <th>Category/Price</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={service._id || `service-${index}`}>
                                    <td>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--glass-bg)' }}>
                                            {(service.thumbnail || service.image) ? (
                                                <Image
                                                    src={getImageUrl(service.thumbnail || service.image)}
                                                    alt={service.title}
                                                    fill
                                                    unoptimized
                                                    sizes="50px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{service.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{service.tagline}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.875rem' }}>&mdash;</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${service.featured ? 'active' : 'inactive'}`}>
                                            {service.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(service.id || service._id || '')} title="View Detail">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(service)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(service.id || service._id || '', service.title)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredServices.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No services found
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
                            <h3 className="admin-card-title">{editingServiceId ? 'Edit Service' : 'Add Service'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tagline</label>
                                    <input name="tagline" className="form-input" value={formData.tagline} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Description (Short)</label>
                                    <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} required rows={2} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Overview (Long)</label>
                                    <textarea name="overview" className="form-input" value={formData.overview} onChange={handleInputChange} rows={4} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">CTA Button Text</label>
                                    <input name="cta" className="form-input" value={formData.cta} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <ImageUpload
                                        label="Service Image/Icon"
                                        value={iconFile || existingIconUrl}
                                        onChange={(file) => setIconFile(file)}
                                        folderPath={`uploads/serviceicon`}
                                        height={200}
                                    />
                                </div>
                                <div className="form-group">
                                    <ImageUpload
                                        label="Thumbnail"
                                        value={thumbnailFile || existingThumbnailUrl}
                                        onChange={(file) => setThumbnailFile(file)}
                                        folderPath={`uploads/serviceicon`}
                                        height={200}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Featured</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                        <span>Show on homepage</span>
                                    </div>
                                </div>

                                {/* Multi-line List Fields */}
                                {[
                                    { name: 'features', label: 'Features (One per line)' },
                                    { name: 'deliverables', label: 'Deliverables (One per line)' },
                                    { name: 'process', label: 'Process (One per line)' },
                                    { name: 'techStack', label: 'Tech Stack (One per line)' },
                                    { name: 'benefits', label: 'Benefits (One per line)' },
                                    { name: 'idealFor', label: 'Ideal For (One per line)' }
                                ].map((field) => (
                                    <div key={field.name} className="form-group">
                                        <label className="form-label">{field.label}</label>
                                        <textarea
                                            name={field.name}
                                            className="form-input"
                                            value={formData[field.name as keyof ServiceFormData] as string}
                                            onChange={handleInputChange}
                                            rows={4}
                                        />
                                    </div>
                                ))}

                                {/* SEO Section */}
                                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>SEO Settings</h4>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Title</label>
                                    <input name="seo.metaTitle" className="form-input" value={formData.seo.metaTitle} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
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

            {/* Premium Service Details Modal */}
            <ServiceDetailModal
                isOpen={isDetailOpen}
                onClose={handleCloseModals}
                service={serviceDetailResponse?.data}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
