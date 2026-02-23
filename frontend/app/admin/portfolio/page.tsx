'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaExternalLinkAlt, FaGithub, FaSpinner, FaProjectDiagram, FaChevronDown } from 'react-icons/fa';
import 'react-quill-new/dist/quill.snow.css';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetPortfoliosQuery,
    useGetPortfolioByIdQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} from '../../../lib/store/api/portfolioApi';
import { useGetTechnologiesQuery } from '../../../lib/store/api/technologiesApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import { getImageUrl } from '../../../lib/utils';
import ImageUpload from '../../../components/ui/ImageUpload';
import PortfolioDetailModal from '../../../components/admin/PortfolioDetailModal';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div style={{ height: 200, background: 'var(--glass-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading editor...</div> });

interface PortfolioFormData {
    title: string;
    description: string;
    longDescription: string;
    category: string;
    industry: string;
    clientName: string;
    clientLocation: string;
    keyFeatures: string;
    technologyStack: string[];
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
    longDescription: '',
    category: 'web-app',
    industry: '',
    clientName: '',
    clientLocation: '',
    keyFeatures: '',
    technologyStack: [],
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
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
    const deleteConfirm = useDeleteConfirm();
    const [techDropdownOpen, setTechDropdownOpen] = useState(false);

    // RTK Query hooks
    const { data: portfolioResponse, isLoading, isError } = useGetPortfoliosQuery();
    const { data: technologiesResponse } = useGetTechnologiesQuery();
    const { data: portfolioDetailResponse } = useGetPortfolioByIdQuery(viewingProjectId!, {
        skip: !viewingProjectId
    });
    const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
    const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
    const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation();

    const projects = portfolioResponse?.data || [];

    // Extract individual technology items grouped by category
    const groupedTechnologies = useMemo(() => {
        const cats = technologiesResponse?.data || [];
        return cats.map((cat: any) => ({
            categoryName: cat.category,
            items: (cat.items || []).map((item: any) => ({
                id: item._id,
                label: item.name,
                icon: item.icon
            }))
        })).filter((cat: any) => cat.items.length > 0);
    }, [technologiesResponse]);

    // Flat list of all items for lookups
    const allTechnologyItems = useMemo(() => {
        return groupedTechnologies.flatMap((cat: any) => cat.items);
    }, [groupedTechnologies]);
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
                longDescription: project.longDescription || '',
                category: project.category || 'web-app',
                industry: project.industry || '',
                clientName: (typeof project.client === 'object' ? project.client?.name : project.client) || '',
                clientLocation: (typeof project.client === 'object' ? project.client?.location : '') || '',
                keyFeatures: project.keyFeatures?.join('\n') || '',
                technologyStack: project.technologyStack?.map((t: any) => typeof t === 'object' ? t._id || t.id : t) || [],
                timeline: project.timeline || '',
                status: project.status || 'Completed',
                servicesProvided: project.servicesProvided?.join('\n') || '',
                liveUrl: project.links?.live || '',
                caseStudyUrl: project.links?.caseStudy || '',
                githubUrl: project.links?.github || '',
                featured: project.featured || false,
            });
            setExistingThumbnailUrl(project.thumbnail || null);
        } else {
            setEditingProjectId(null);
            setFormData(initialFormData);
            setExistingThumbnailUrl(null);
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
        setExistingThumbnailUrl(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    // File handler replaced by ImageUpload component handler directly in JSX

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('longDescription', formData.longDescription);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('industry', formData.industry);
        formDataToSend.append('clientName', formData.clientName);
        formDataToSend.append('clientLocation', formData.clientLocation);
        formDataToSend.append('timeline', formData.timeline);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('liveLink', formData.liveUrl);
        formDataToSend.append('caseStudyLink', formData.caseStudyUrl);
        formDataToSend.append('githubLink', formData.githubUrl ? String(formData.githubUrl) : "");
        formDataToSend.append('featured', String(formData.featured));

        // Folder path for organization
        formDataToSend.append('folder', `portfolio`);

        // Array fields (one per line)
        formData.keyFeatures.split('\n').map((s: string) => s.trim()).filter((s: string) => s).forEach((item: string) =>
            formDataToSend.append('keyFeatures[]', item)
        );
        formData.servicesProvided.split('\n').map((s: string) => s.trim()).filter((s: string) => s).forEach((item: string) =>
            formDataToSend.append('servicesProvided[]', item)
        );

        // TechStack handling removed in favor of technologyStack
        if (thumbnailFile) {
            formDataToSend.append('thumbnail', thumbnailFile);
        }

        // Technology Stack IDs as JSON array
        if (formData.technologyStack.length > 0) {
            formDataToSend.append('technologyStack', JSON.stringify(formData.technologyStack));
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
            dispatch(showErrorNotification(err?.data?.error?.message || err?.data?.message || 'Failed to save project'));
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
                    dispatch(showErrorNotification(err?.data?.error?.message || err?.data?.message || 'Failed to delete project'));
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
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Long Description (Rich Text)</label>
                                    <div style={{ background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.longDescription}
                                            onChange={(value: string) => setFormData(prev => ({ ...prev, longDescription: value }))}
                                            style={{ minHeight: '200px' }}
                                            modules={{
                                                toolbar: [
                                                    [{ 'font': [] }, { 'size': [] }],
                                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                    [{ 'direction': 'rtl' }, { 'align': [] }],
                                                    ['blockquote', 'code-block'],
                                                    ['link', 'image', 'video', 'formula'],
                                                    ['clean']
                                                ]
                                            }}
                                        />
                                    </div>
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
                                    <ImageUpload
                                        label="Project Thumbnail"
                                        value={thumbnailFile || existingThumbnailUrl}
                                        onChange={(file) => setThumbnailFile(file)}
                                        folderPath={`uploads/portfolio`}
                                        height={250}
                                    />
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
                                    <label className="form-label">Technologies Used</label>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            type="button"
                                            className="form-input"
                                            onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', width: '100%', minHeight: '42px' }}
                                        >
                                            <span style={{ color: formData.technologyStack.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                                {formData.technologyStack.length > 0
                                                    ? `${formData.technologyStack.length} technolog${formData.technologyStack.length === 1 ? 'y' : 'ies'} selected`
                                                    : 'Select technologies...'}
                                            </span>
                                            <FaChevronDown style={{ fontSize: '0.75rem', transition: 'transform 0.2s', transform: techDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                                        </button>
                                        {techDropdownOpen && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                                                background: '#ffffff', color: '#1a1a1a', border: '1px solid var(--border-primary)',
                                                borderRadius: '8px', marginTop: '4px', maxHeight: '300px', overflowY: 'auto',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                            }}>
                                                {groupedTechnologies.map((group: any) => (
                                                    <div key={group.categoryName}>
                                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            {group.categoryName}
                                                        </div>
                                                        {group.items.map((item: any) => (
                                                            <label key={item.id} style={{
                                                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', paddingLeft: '1.5rem',
                                                                cursor: 'pointer', borderBottom: '1px solid var(--border-primary)',
                                                                transition: 'background 0.15s'
                                                            }}
                                                                onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
                                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.technologyStack.includes(item.id)}
                                                                    onChange={() => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            technologyStack: prev.technologyStack.includes(item.id)
                                                                                ? prev.technologyStack.filter(id => id !== item.id)
                                                                                : [...prev.technologyStack, item.id]
                                                                        }));
                                                                    }}
                                                                />
                                                                {item.icon && <img src={getImageUrl(item.icon)} alt={item.label} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />}
                                                                <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ))}
                                                {groupedTechnologies.length === 0 && (
                                                    <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
                                                        No technologies available
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {formData.technologyStack.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {formData.technologyStack.map(id => {
                                                const tech = allTechnologyItems.find((t: any) => t.id === id);
                                                return tech ? (
                                                    <span key={id} style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                                                        background: 'var(--accent-start)', color: 'white'
                                                    }}>
                                                        {tech.icon && <img src={getImageUrl(tech.icon)} alt="" style={{ width: '12px', height: '12px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                                                        {tech.label}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, technologyStack: prev.technologyStack.filter(tId => tId !== id) }))}
                                                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px' }}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Key Features (one per line)</label>
                                    <textarea name="keyFeatures" className="form-input" value={formData.keyFeatures} onChange={handleInputChange} rows={3} placeholder="AI-powered recommendations&#10;Real-time inventory&#10;Multi-currency support" />
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
