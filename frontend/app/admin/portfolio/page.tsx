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
import { getImageUrl } from '../../../lib/utils';
import PortfolioDetailModal from '../../../components/admin/PortfolioDetailModal';

interface PortfolioFormData {
    title: string;
    description: string;
    category: string;
    industry: string;
    clientName: string;
    clientLocation: string;
    keyFeatures: string;
    techStack: string;
    timeline: string;
    status: string;
    servicesProvided: string;
    liveUrl: string;
    caseStudyUrl: string;
    githubUrl: string;
    featured: boolean;
}

const initialFormData: PortfolioFormData = {
    title: '',
    description: '',
    category: 'web-app',
    industry: '',
    clientName: '',
    clientLocation: '',
    keyFeatures: '',
    techStack: '',
    timeline: '',
    status: 'Completed',
    servicesProvided: '',
    liveUrl: '',
    caseStudyUrl: '',
    githubUrl: '',
    featured: false,
};

const categories = ['web-app', 'mobile-app', 'e-commerce', 'saas', 'website', 'other'];
const statusOptions = ['In Progress', 'Completed', 'Live', 'Archived'];

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
            setEditingProjectId(project.id || project._id);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                category: project.category || 'web-app',
                industry: project.industry || '',
                clientName: (typeof project.client === 'object' ? project.client?.name : project.client) || '',
                clientLocation: (typeof project.client === 'object' ? project.client?.location : '') || '',
                keyFeatures: project.keyFeatures?.join('\n') || '',
                techStack: typeof project.techStack === 'object'
                    ? Object.entries(project.techStack).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
                    : '',
                timeline: project.timeline || '',
                status: project.status || 'Completed',
                servicesProvided: project.servicesProvided?.join('\n') || '',
                liveUrl: project.links?.live || '',
                caseStudyUrl: project.links?.caseStudy || '',
                githubUrl: project.links?.github || '',
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
        formDataToSend.append('industry', formData.industry);
        formDataToSend.append('clientName', formData.clientName);
        formDataToSend.append('clientLocation', formData.clientLocation);
        formDataToSend.append('timeline', formData.timeline);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('liveLink', formData.liveUrl);
        formDataToSend.append('caseStudyLink', formData.caseStudyUrl);
        formDataToSend.append('githubLink', formData.githubUrl);
        formDataToSend.append('featured', String(formData.featured));

        // Array fields (one per line)
        formData.keyFeatures.split('\n').map((s: string) => s.trim()).filter((s: string) => s).forEach((item: string) =>
            formDataToSend.append('keyFeatures[]', item)
        );
        formData.servicesProvided.split('\n').map((s: string) => s.trim()).filter((s: string) => s).forEach((item: string) =>
            formDataToSend.append('servicesProvided[]', item)
        );

        // TechStack as JSON object
        if (formData.techStack.trim()) {
            const techStackObj: Record<string, string[]> = {};
            formData.techStack.split('\n').forEach(line => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const category = parts[0].trim();
                    const techs = parts.slice(1).join(':').split(',').map(t => t.trim()).filter(Boolean);
                    if (category && techs.length > 0) {
                        techStackObj[category] = techs;
                    }
                }
            });
            formDataToSend.append('techStack', JSON.stringify(techStackObj));
        }

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
                                                    <Image src={getImageUrl(project.thumbnail)} alt={project.title} width={48} height={40} unoptimized style={{ objectFit: 'cover', borderRadius: '6px' }} />
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
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(project.id || project._id || '')} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(project)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(project.id || project._id || '', project.title)}
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
                                <div className="form-group">
                                    <label className="form-label">Industry</label>
                                    <input name="industry" className="form-input" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Healthcare, Fintech" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Description</label>
                                    <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} required rows={3} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Client Name</label>
                                    <input name="clientName" className="form-input" value={formData.clientName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Client Location</label>
                                    <input name="clientLocation" className="form-input" value={formData.clientLocation} onChange={handleInputChange} placeholder="e.g. New York, USA" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Timeline</label>
                                    <input name="timeline" className="form-input" value={formData.timeline} onChange={handleInputChange} placeholder="e.g. 3 months" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Thumbnail</label>
                                    <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Live URL</label>
                                    <input name="liveUrl" className="form-input" value={formData.liveUrl} onChange={handleInputChange} placeholder="https://" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Case Study URL</label>
                                    <input name="caseStudyUrl" className="form-input" value={formData.caseStudyUrl} onChange={handleInputChange} placeholder="https://" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub URL</label>
                                    <input name="githubUrl" className="form-input" value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Featured</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                        <span>Show on homepage</span>
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Key Features (one per line)</label>
                                    <textarea name="keyFeatures" className="form-input" value={formData.keyFeatures} onChange={handleInputChange} rows={3} placeholder="AI-powered recommendations&#10;Real-time inventory&#10;Multi-currency support" />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Tech Stack (format: category: tech1, tech2)</label>
                                    <textarea name="techStack" className="form-input" value={formData.techStack} onChange={handleInputChange} rows={3} placeholder="frontend: React, Next.js&#10;backend: Node.js, MongoDB&#10;devops: Docker, AWS" />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Services Provided (one per line)</label>
                                    <textarea name="servicesProvided" className="form-input" value={formData.servicesProvided} onChange={handleInputChange} rows={2} placeholder="Web Development&#10;UI/UX Design&#10;Cloud Deployment" />
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

            {/* Premium Portfolio Details Modal */}
            <PortfolioDetailModal
                isOpen={isDetailOpen}
                onClose={handleCloseModals}
                project={portfolioDetailResponse?.data}
            />

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
