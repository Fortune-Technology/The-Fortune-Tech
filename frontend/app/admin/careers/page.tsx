'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaBriefcase, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetCareersQuery,
    useGetCareerByIdQuery,
    useCreateCareerMutation,
    useUpdateCareerMutation,
    useDeleteCareerMutation,
} from '../../../lib/store/api/careersApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import CareerDetailModal from '../../../components/admin/CareerDetailModal';

interface CareerFormData {
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    isActive: boolean;
    featured: boolean;
}

const initialFormData: CareerFormData = {
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experience: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    isActive: true,
    featured: false,
};

const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Other'];

export default function CareersPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
    const [viewingCareerId, setViewingCareerId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CareerFormData>(initialFormData);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: careersResponse, isLoading, isError } = useGetCareersQuery();
    const { data: careerDetailResponse } = useGetCareerByIdQuery(viewingCareerId!, {
        skip: !viewingCareerId
    });
    const [createCareer, { isLoading: isCreating }] = useCreateCareerMutation();
    const [updateCareer, { isLoading: isUpdating }] = useUpdateCareerMutation();
    const [deleteCareer, { isLoading: isDeleting }] = useDeleteCareerMutation();

    const careers = careersResponse?.data || [];

    const filteredCareers = careers.filter(career => {
        const matchesSearch = (career.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (career.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = !departmentFilter || career.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });

    const handleOpenModal = (career: any = null) => {
        if (career) {
            setEditingCareerId(career._id);
            setFormData({
                title: career.title || '',
                department: career.department || '',
                location: career.location || '',
                type: career.type || 'full-time',
                experience: career.experience || '',
                description: career.description || '',
                requirements: career.requirements?.join('\n') || '',
                responsibilities: career.responsibilities?.join('\n') || '',
                benefits: career.benefits?.join('\n') || '',
                isActive: career.isActive ?? true,
                featured: career.featured || false,
            });
        } else {
            setEditingCareerId(null);
            setFormData(initialFormData);
        }
        setIsModalOpen(true);
    };

    const handleOpenDetail = (careerId: string) => {
        setViewingCareerId(careerId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingCareerId(null);
        setViewingCareerId(null);
        setFormData(initialFormData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = {
            title: formData.title,
            department: formData.department,
            location: formData.location,
            type: formData.type as 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote',
            experience: formData.experience,
            description: formData.description,
            requirements: formData.requirements.split('\n').filter(i => i.trim()),
            responsibilities: formData.responsibilities.split('\n').filter(i => i.trim()),
            benefits: formData.benefits.split('\n').filter(i => i.trim()),
            isActive: formData.isActive,
            featured: formData.featured,
        };

        try {
            if (editingCareerId) {
                await updateCareer({ id: editingCareerId, data: dataToSend }).unwrap();
                dispatch(showSuccessNotification('Career position updated successfully'));
            } else {
                await createCareer(dataToSend).unwrap();
                dispatch(showSuccessNotification('Career position created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save career position'));
        }
    };

    const handleDelete = (id: string, title: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Career Position',
            message: 'This action will permanently delete this job listing. This cannot be undone.',
            itemName: title,
            onConfirm: async () => {
                try {
                    await deleteCareer(id).unwrap();
                    dispatch(showSuccessNotification('Career position deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete career position'));
                }
            }
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Careers">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading careers...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Careers">
                <div className="admin-error">
                    <p>Failed to load careers. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Careers">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search careers..."
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
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> Add Position
                    </button>
                </div>
            </div>

            {/* Careers Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Positions ({filteredCareers.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCareers.map((career, index) => (
                                <tr key={career._id || `career-${index}`}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="position-icon">
                                                <FaBriefcase />
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{career.title}</span>
                                                {career.featured && <span className="featured-tag">Featured</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{career.department || 'N/A'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FaMapMarkerAlt size={12} style={{ color: 'var(--text-muted)' }} />
                                            {career.location || 'Remote'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="type-badge">{career.type?.replace('-', ' ')}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${career.isActive ? 'active' : 'inactive'}`}>
                                            {career.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(career.id || career._id)} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(career)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(career.id || career._id, career.title)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCareers.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No career positions found
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
                    <div className="modal-content" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingCareerId ? 'Edit Position' : 'Add Position'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Job Title</label>
                                    <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <select name="department" className="form-input" value={formData.department} onChange={handleInputChange}>
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input name="location" className="form-input" value={formData.location} onChange={handleInputChange} placeholder="e.g. New York, Remote" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Type</label>
                                    <select name="type" className="form-input" value={formData.type} onChange={handleInputChange}>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Experience Required</label>
                                    <input name="experience" className="form-input" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 3-5 years" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', height: '42px', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                                            Active
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                            Featured
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Job Description</label>
                                    <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} required rows={4} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Requirements (one per line)</label>
                                    <textarea name="requirements" className="form-input" value={formData.requirements} onChange={handleInputChange} rows={5} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Responsibilities (one per line)</label>
                                    <textarea name="responsibilities" className="form-input" value={formData.responsibilities} onChange={handleInputChange} rows={5} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Benefits (one per line)</label>
                                    <textarea name="benefits" className="form-input" value={formData.benefits} onChange={handleInputChange} rows={3} />
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

            {/* Premium Career Details Modal */}
            <CareerDetailModal
                isOpen={isDetailOpen}
                onClose={handleCloseModals}
                career={careerDetailResponse?.data}
            />

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
