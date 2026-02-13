import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag, FaTools, FaCheckCircle, FaListUl, FaLayerGroup, FaSearch, FaRocket } from 'react-icons/fa';
import { getImageUrl } from '../../lib/utils';
import { useEffect } from 'react';

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
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

export default function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !service) return null;

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
                            className="premium-modal service-detail-modal"
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

                            <div className="modal-header-profile">
                                <div className="modal-cover-bg service-cover">
                                    {service.image && (
                                        <img src={getImageUrl(service.image)} alt="" className="cover-img-blur" />
                                    )}
                                </div>
                                <div className="modal-avatar-wrapper">
                                    <div className="modal-avatar-ring service-icon-ring">
                                        {service.thumbnail ? (
                                            <img
                                                src={getImageUrl(service.thumbnail)}
                                                alt={service.title}
                                                className="modal-avatar-img"
                                            />
                                        ) : (
                                            <div className="modal-avatar-placeholder">
                                                <FaRocket />
                                            </div>
                                        )}
                                    </div>
                                    {service.featured && <div className="status-indicator active featured-dot"></div>}
                                </div>
                                <div className="modal-title-section">
                                    <h2 className="modal-user-name">{service.title}</h2>
                                    <p className="modal-user-subtitle">{service.tagline}</p>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                <div className="modal-section">
                                    <h3 className="section-title">Overview</h3>
                                    <p className="service-description-text">{service.description}</p>
                                    {service.overview && (
                                        <div className="service-overview-box">
                                            <p>{service.overview}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-lists-grid premium-lists">
                                    {service.features?.length > 0 && (
                                        <div className="modal-section list-section">
                                            <h3 className="section-title"><FaListUl /> Key Features</h3>
                                            <ul className="premium-list">
                                                {service.features.map((item: string, i: number) => (
                                                    <li key={i}><FaCheckCircle /> {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {service.techStack?.length > 0 && (
                                        <div className="modal-section list-section">
                                            <h3 className="section-title"><FaTools /> Technology Stack</h3>
                                            <div className="tech-pills">
                                                {service.techStack.map((item: string, i: number) => (
                                                    <span key={i} className="tech-pill">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {service.deliverables?.length > 0 && (
                                        <div className="modal-section list-section">
                                            <h3 className="section-title"><FaLayerGroup /> Deliverables</h3>
                                            <ul className="premium-list">
                                                {service.deliverables.map((item: string, i: number) => (
                                                    <li key={i}><FaCheckCircle /> {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-section seo-info-section">
                                    <h3 className="section-title"><FaSearch /> SEO Optimization</h3>
                                    <div className="seo-preview">
                                        <div className="seo-title">{service.seo?.metaTitle || service.title}</div>
                                        <div className="seo-url">fortunetech.co/services/{service.slug || service.title.toLowerCase().replace(/ /g, '-')}</div>
                                        <div className="seo-desc">{service.seo?.metaDescription || service.description}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
