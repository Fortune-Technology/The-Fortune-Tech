import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaGithub, FaCalendarAlt, FaUser, FaTag, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { getImageUrl } from '../../lib/utils';
import { useEffect } from 'react';
import Image from 'next/image';

interface PortfolioDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
} as const;

const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, y: 50, scale: 0.95 }
} as const;

export default function PortfolioDetailModal({ isOpen, onClose, project }: PortfolioDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !project) return null;

    const clientName = typeof project.client === 'object' ? project.client?.name : project.client;
    const clientLocation = typeof project.client === 'object' ? project.client?.location : '';
    const liveUrl = project.links?.live || project.projectUrl;
    const githubUrl = project.links?.github || project.githubUrl;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay-backdrop" onClick={onClose}>
                    <motion.div
                        className="modal-container"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <motion.div
                            className="premium-modal portfolio-detail-modal"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            data-lenis-prevent
                        >
                            <button className="modal-close-btn" onClick={onClose}>
                                <FaTimes />
                            </button>

                            <div className="modal-header-profile no-avatar">
                                <div className="modal-cover-bg portfolio-cover">
                                    {project.thumbnail && (
                                        <Image
                                            src={getImageUrl(project.thumbnail)}
                                            alt={project.title}
                                            fill
                                            className="cover-img-blur"
                                            unoptimized
                                        />
                                    )}
                                </div>
                                <div className="modal-title-section modal-title-centered">
                                    <h2 className="modal-user-name">{project.title}</h2>
                                    <p className="modal-user-subtitle">{project.category?.replace('-', ' ').toUpperCase()} • {project.industry || 'General'}</p>
                                    <div className="modal-meta-row modal-meta-centered">
                                        <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-') || 'completed'}`}>
                                            {project.status || 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                {project.thumbnail && (
                                    <div className="portfolio-main-preview">
                                        <Image
                                            src={getImageUrl(project.thumbnail)}
                                            alt={project.title}
                                            width={800}
                                            height={450}
                                            className="main-preview-img"
                                            unoptimized
                                        />
                                    </div>
                                )}

                                <div className="modal-section">
                                    <h3 className="section-title">Project Overview</h3>
                                    <p className="service-description-text">{project.description}</p>
                                </div>

                                <div className="info-grid three-cols">
                                    <div className="info-item">
                                        <div className="info-icon"><FaUser /></div>
                                        <div className="info-content">
                                            <label>Client</label>
                                            <p>{clientName || 'Confidential'}</p>
                                            {clientLocation && <small>{clientLocation}</small>}
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><FaCalendarAlt /></div>
                                        <div className="info-content">
                                            <label>Timeline</label>
                                            <p>{project.timeline || project.duration || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><FaTag /></div>
                                        <div className="info-content">
                                            <label>Industry</label>
                                            <p>{project.industry || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-lists-grid premium-lists">
                                    {project.keyFeatures?.length > 0 && (
                                        <div className="modal-section list-section">
                                            <h3 className="section-title"><FaCheckCircle /> Key Features</h3>
                                            <ul className="premium-list">
                                                {project.keyFeatures.map((item: string, i: number) => (
                                                    <li key={i}><FaCheckCircle /> {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {project.servicesProvided?.length > 0 && (
                                        <div className="modal-section list-section">
                                            <h3 className="section-title"><FaRocket /> Services Provided</h3>
                                            <ul className="premium-list">
                                                {project.servicesProvided.map((item: string, i: number) => (
                                                    <li key={i}><FaCheckCircle /> {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {project.techStack && (
                                    <div className="modal-section">
                                        <h3 className="section-title">Technology Stack</h3>
                                        <div className="tech-stack-details">
                                            {typeof project.techStack === 'object' && !Array.isArray(project.techStack) ? (
                                                Object.entries(project.techStack).map(([category, techs]) => (
                                                    <div key={category} className="tech-group-row">
                                                        <label>{category}:</label>
                                                        <div className="tech-pills">
                                                            {(typeof techs === 'string' ? techs.split(',') : (Array.isArray(techs) ? techs : [])).map((t: any, i: number) => (
                                                                <span key={i} className="tech-pill">{String(t).trim()}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : Array.isArray(project.techStack) ? (
                                                <div className="tech-pills">
                                                    {project.techStack.map((t: string, i: number) => (
                                                        <span key={i} className="tech-pill">{t}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted">{project.techStack}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-footer-badges">
                                    {liveUrl && (
                                        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                            <FaExternalLinkAlt /> View Live Project
                                        </a>
                                    )}
                                    {githubUrl && (
                                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                            <FaGithub /> View Source
                                        </a>
                                    )}
                                    {project.featured && <span className="status-badge featured status-badge-ml-auto">Featured Project</span>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
