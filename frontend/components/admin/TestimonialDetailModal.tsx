import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaQuoteLeft, FaStar, FaBuilding, FaBriefcase, FaGlobe } from 'react-icons/fa';
import { getImageUrl } from '../../lib/utils';
import { useEffect } from 'react';

interface TestimonialDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    testimonial: any;
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

export default function TestimonialDetailModal({ isOpen, onClose, testimonial }: TestimonialDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !testimonial) return null;

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar key={i} style={{ color: i < rating ? '#f59e0b' : 'var(--text-muted)', fontSize: '1rem' }} />
        ));
    };

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
                            className="premium-modal testimonial-detail-modal"
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
                                <div className="modal-cover-bg testimonial-cover"></div>
                                <div className="modal-avatar-wrapper">
                                    <div className="modal-avatar-ring">
                                        {(testimonial.thumbnail || testimonial.avatar) ? (
                                            <img
                                                src={getImageUrl(testimonial.thumbnail || testimonial.avatar)}
                                                alt={testimonial.name}
                                                className="modal-avatar-img"
                                            />
                                        ) : (
                                            <div className="modal-avatar-placeholder">
                                                {testimonial.name ? testimonial.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                                            </div>
                                        )}
                                    </div>
                                    {testimonial.verified !== false && <div className="status-indicator active verified-check"></div>}
                                </div>
                                <div className="modal-title-section">
                                    <h2 className="modal-user-name">{testimonial.name}</h2>
                                    <p className="modal-user-subtitle">{testimonial.role} at {testimonial.company}</p>
                                    <div className="modal-rating-wrapper">
                                        {renderStars(testimonial.rating || 5)}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                <div className="modal-section quote-section">
                                    <FaQuoteLeft className="quote-icon-bg" />
                                    <p className="testimonial-content-text">{testimonial.content}</p>
                                </div>

                                <div className="modal-section">
                                    <h3 className="section-title">Client Details</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <div className="info-icon"><FaBuilding /></div>
                                            <div className="info-content">
                                                <label>Industry</label>
                                                <p>{testimonial.industry || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaBriefcase /></div>
                                            <div className="info-content">
                                                <label>Service Provided</label>
                                                <p>{testimonial.serviceProvided || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        {testimonial.website && (
                                            <div className="info-item">
                                                <div className="info-icon"><FaGlobe /></div>
                                                <div className="info-content">
                                                    <label>Website</label>
                                                    <p><a href={testimonial.website} target="_blank" rel="noopener noreferrer">{testimonial.website.replace(/^https?:\/\//, '')}</a></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer-badges">
                                    {testimonial.featured && <span className="status-badge featured">Featured Review</span>}
                                    {testimonial.verified !== false && <span className="status-badge verified">Verified Client</span>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
