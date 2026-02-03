'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaExternalLinkAlt, FaGithub, FaSpinner, FaProjectDiagram } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetPortfoliosQuery,
    useGetPortfolioByIdQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} from '../../../lib/store/api/portfolioApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';

interface PortfolioFormData {
    title: string;
    description: string;
    category: string;
    technologies: string;
    client: string;
    projectUrl: string;
    githubUrl: string;
    duration: string;
    year: string;
    featured: boolean;
}

const initialFormData: PortfolioFormData = {
    title: '',
    description: '',
    category: 'web-app',
    technologies: '',
    client: '',
    projectUrl: '',
    githubUrl: '',
    duration: '',
    year: new Date().getFullYear().toString(),
    featured: false,
};

const categories = ['web-app', 'mobile-app', 'e-commerce', 'saas', 'website', 'other'];

export default function PortfolioPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [viewingProjectId, setViewingProjectId] = useState<string | null>(null);
    const [formData, setFormData] = useState<PortfolioFormData>(initialFormData);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: portfolioResponse, isLoading, isError } = useGetPortfoliosQuery();
    const { data: portfolioDetailResponse } = useGetPortfolioByIdQuery(viewingProjectId!, {
        skip: !viewingProjectId
    });
    const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
    const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
    const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation();

    const projects = portfolioResponse?.data || [];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || project.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (project: any = null) => {
        if (project) {
            setEditingProjectId(project._id);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                category: project.category || 'web-app',
                technologies: project.technologies?.join(', ') || '',
                client: (typeof project.client === 'object' ? project.client?.name : project.client) || '',
                projectUrl: project.projectUrl || '',
                githubUrl: project.githubUrl || '',
                duration: project.duration || '',
                year: project.year?.toString() || new Date().getFullYear().toString(),
                featured: project.featured || false,
            });
        } else {
            setEditingProjectId(null);
            setFormData(initialFormData);
        }
        setThumbnailFile(null);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (projectId: string) => {
        setViewingProjectId(projectId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingProjectId(null);
        setViewingProjectId(null);
        setFormData(initialFormData);
        setThumbnailFile(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('client', formData.client);
        formDataToSend.append('projectUrl', formData.projectUrl);
        formDataToSend.append('githubUrl', formData.githubUrl);
        formDataToSend.append('duration', formData.duration);
        formDataToSend.append('year', formData.year);
        formDataToSend.append('featured', String(formData.featured));

        // Technologies array
        const technologies = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
        technologies.forEach(tech => formDataToSend.append('technologies[]', tech));

        if (thumbnailFile) {
            formDataToSend.append('thumbnail', thumbnailFile);
        }

        try {
            if (editingProjectId) {
                await updatePortfolio({ id: editingProjectId, data: formDataToSend }).unwrap();
                dispatch(showSuccessNotification('Project updated successfully'));
            } else {
                await createPortfolio(formDataToSend).unwrap();
                dispatch(showSuccessNotification('Project created successfully'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save project'));
        }
    };

    const handleDelete = (id: string, title: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Project',
            message: 'This action will permanently delete this project from the portfolio. This cannot be undone.',
            itemName: title,
            onConfirm: async () => {
                try {
                    await deletePortfolio(id).unwrap();
                    dispatch(showSuccessNotification('Project deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete project'));
                }
            }
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Portfolio">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading projects...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Portfolio">
                <div className="admin-error">
                    <p>Failed to load projects. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Portfolio">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search projects..."
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
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> Add Project
                    </button>
                </div>
            </div>

            {/* Projects Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Projects ({filteredProjects.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>PROJECT</th>
                                <th>CATEGORY</th>
                                <th>CLIENT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project, index) => (
                                <tr key={project._id || `project-${index}`}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="project-thumbnail">
                                                {project.thumbnail ? (
                                                    <Image src={project.thumbnail} alt={project.title} width={48} height={40} style={{ objectFit: 'cover', borderRadius: '6px' }} />
                                                ) : (
                                                    <div className="project-placeholder">
                                                        <FaProjectDiagram />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{project.title}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.industry || 'General'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{project.category}</td>
                                    <td>{project.client && typeof project.client === 'object' ? (project.client as any).name : (project.client || 'N/A')}</td>
                                    <td>
                                        <span className={`status-badge ${project.status || 'completed'}`}>
                                            {(project.status || 'completed').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(project._id)} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(project)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(project._id, project.title)}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProjects.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No projects found
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
                            <h3 className="admin-card-title">{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select name="category" className="form-input" value={formData.category} onChange={handleInputChange}>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Description</label>
                                    <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} required rows={3} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Technologies (comma separated)</label>
                                    <input name="technologies" className="form-input" value={formData.technologies} onChange={handleInputChange} placeholder="React, Node.js, MongoDB" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Client</label>
                                    <input name="client" className="form-input" value={formData.client} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Project URL</label>
                                    <input name="projectUrl" className="form-input" value={formData.projectUrl} onChange={handleInputChange} placeholder="https://" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub URL</label>
                                    <input name="githubUrl" className="form-input" value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input name="duration" className="form-input" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 3 months" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input name="year" type="number" className="form-input" value={formData.year} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Thumbnail</label>
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
            {isDetailOpen && portfolioDetailResponse?.data && (
                <div className="modal-overlay">
                    <div className="modal-content detail-view" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{portfolioDetailResponse.data.title}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            {portfolioDetailResponse.data.thumbnail && (
                                <div style={{ position: 'relative', height: '300px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
                                    <Image src={portfolioDetailResponse.data.thumbnail} alt={portfolioDetailResponse.data.title} fill style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="detail-grid">
                                <div className="detail-section">
                                    <h5>Project Info</h5>
                                    <p><strong>Category:</strong> {portfolioDetailResponse.data.category}</p>
                                    <p><strong>Client:</strong> {portfolioDetailResponse.data.client && typeof portfolioDetailResponse.data.client === 'object' ? (portfolioDetailResponse.data.client as any).name : (portfolioDetailResponse.data.client || 'N/A')}</p>
                                    <p><strong>Duration:</strong> {portfolioDetailResponse.data.duration || 'N/A'}</p>
                                    <p><strong>Year:</strong> {portfolioDetailResponse.data.year}</p>
                                    <p><strong>Featured:</strong> {portfolioDetailResponse.data.featured ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="detail-section">
                                    <h5>Description</h5>
                                    <p>{portfolioDetailResponse.data.description}</p>
                                    {portfolioDetailResponse.data.technologies && portfolioDetailResponse.data.technologies.length > 0 && (
                                        <>
                                            <h5 style={{ marginTop: '1rem' }}>Technologies</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {portfolioDetailResponse.data.technologies.map((tech: string, idx: number) => (
                                                    <span key={idx} className="tech-badge">{tech}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                {portfolioDetailResponse.data.projectUrl && (
                                    <a href={portfolioDetailResponse.data.projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <FaExternalLinkAlt /> Live Demo
                                    </a>
                                )}
                                {portfolioDetailResponse.data.githubUrl && (
                                    <a href={portfolioDetailResponse.data.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                        <FaGithub /> GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
