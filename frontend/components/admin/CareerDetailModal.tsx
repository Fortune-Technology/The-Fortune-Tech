import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaClock, FaChessBoard, FaCheckCircle, FaStar } from 'react-icons/fa';
import { useEffect } from 'react';

interface CareerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    career: any;
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

export default function CareerDetailModal({ isOpen, onClose, career }: CareerDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !career) return null;

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
                            className="premium-modal career-detail-modal"
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
                                <div className="modal-cover-bg career-cover"></div>
                                <div className="modal-avatar-wrapper">
                                    <div className="modal-avatar-ring career-icon-ring">
                                        <FaBriefcase />
                                    </div>
                                    <div className={`status-indicator ${career.isActive ? 'active' : 'inactive'}`}></div>
                                </div>
                                <div className="modal-title-section">
                                    <h2 className="modal-user-name">{career.title}</h2>
                                    <p className="modal-user-subtitle">{career.department} Department</p>
                                    <div className="modal-meta-row">
                                        <span className="meta-item"><FaMapMarkerAlt /> {career.location || 'Remote'}</span>
                                        <span className="meta-item"><FaClock /> {career.type?.replace('-', ' ')}</span>
                                        <span className="meta-item"><FaChessBoard /> {career.experience || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                <div className="modal-section">
                                    <h3 className="section-title">Job Description</h3>
                                    <p className="career-description-text">{career.description}</p>
                                </div>

                                {career.responsibilities?.length > 0 && (
                                    <div className="modal-section">
                                        <h3 className="section-title">What You'll Do</h3>
                                        <ul className="premium-list">
                                            {career.responsibilities.map((item: string, i: number) => (
                                                <li key={i}><FaCheckCircle className="career-bullet" /> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {career.requirements?.length > 0 && (
                                    <div className="modal-section">
                                        <h3 className="section-title">Requirements</h3>
                                        <ul className="premium-list">
                                            {career.requirements.map((item: string, i: number) => (
                                                <li key={i}><FaStar className="career-bullet" /> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {career.benefits?.length > 0 && (
                                    <div className="modal-section">
                                        <h3 className="section-title">Perks & Benefits</h3>
                                        <div className="benefits-grid">
                                            {career.benefits.map((item: string, i: number) => (
                                                <div key={i} className="benefit-pill">{item}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-footer-badges">
                                    {career.featured && <span className="status-badge featured">Urgent Hiring</span>}
                                    <span className={`status-badge ${career.isActive ? 'verified' : 'inactive'}`}>
                                        {career.isActive ? 'Accepting Applications' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
