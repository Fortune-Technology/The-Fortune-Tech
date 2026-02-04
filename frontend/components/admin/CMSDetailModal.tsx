import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGlobe, FaFileAlt, FaCalendarAlt, FaHistory, FaTag, FaCheckCircle, FaSearch, FaEye } from 'react-icons/fa';
import { useEffect } from 'react';
import { formatDate } from '../../lib/utils';

interface CMSDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    page: any;
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

export default function CMSDetailModal({ isOpen, onClose, page }: CMSDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !page) return null;

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
                            className="premium-modal cms-detail-modal"
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
                                <div className="modal-cover-bg cms-cover"></div>
                                <div className="modal-title-section" style={{ padding: '3rem 2rem 1.5rem' }}>
                                    <h2 className="modal-user-name">{page.title}</h2>
                                    <p className="modal-user-subtitle">/{page.slug}</p>
                                    <div className="modal-meta-row" style={{ justifyContent: 'center' }}>
                                        <span className={`status-badge ${page.status}`}>
                                            {page.status?.toUpperCase()}
                                        </span>
                                        <span className="type-badge">{page.type?.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                <div className="info-grid three-cols">
                                    <div className="info-item">
                                        <div className="info-icon"><FaCalendarAlt /></div>
                                        <div className="info-content">
                                            <label>Created At</label>
                                            <p>{formatDate(page.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><FaHistory /></div>
                                        <div className="info-content">
                                            <label>Last Updated</label>
                                            <p>{formatDate(page.updatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><FaTag /></div>
                                        <div className="info-content">
                                            <label>Featured</label>
                                            <p>{page.featured ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {page.excerpt && (
                                    <div className="modal-section">
                                        <h3 className="section-title">Excerpt</h3>
                                        <p className="service-description-text">{page.excerpt}</p>
                                    </div>
                                )}

                                <div className="modal-section">
                                    <h3 className="section-title">Content Preview</h3>
                                    <div
                                        className="content-preview-premium"
                                        dangerouslySetInnerHTML={{ __html: page.content }}
                                    />
                                </div>

                                {page.seo && (
                                    <div className="modal-section">
                                        <h3 className="section-title"><FaSearch /> SEO Optimization</h3>
                                        <div className="seo-preview">
                                            <div className="seo-title">{page.seo.metaTitle || page.title}</div>
                                            <div className="seo-url">fortunetech.co/{page.slug}</div>
                                            <div className="seo-desc">{page.seo.metaDescription || page.excerpt || 'No description provided.'}</div>
                                            {page.seo.keywords?.length > 0 && (
                                                <div className="tech-pills" style={{ marginTop: '1rem' }}>
                                                    {page.seo.keywords.map((k: string, i: number) => (
                                                        <span key={i} className="tech-pill">{k}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-footer-badges">
                                    <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <FaEye /> View Live Page
                                    </a>
                                    {page.status !== 'published' && (
                                        <div className="status-badge pending" style={{ marginLeft: 'auto' }}>
                                            Draft Mode
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
