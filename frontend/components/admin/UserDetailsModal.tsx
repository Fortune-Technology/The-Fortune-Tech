import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaShieldAlt, FaUser } from 'react-icons/fa';
import { getImageUrl, formatDate } from '../../lib/utils';
import { useEffect } from 'react';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
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

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !user) return null;

    const userInitials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';

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
                            className="premium-modal"
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
                                <div className="modal-cover-bg"></div>
                                <div className="modal-avatar-wrapper">
                                    <div className="modal-avatar-ring">
                                        {user.avatar ? (
                                            <img
                                                src={getImageUrl(user.avatar)}
                                                alt={user.name}
                                                className="modal-avatar-img"
                                            />
                                        ) : (
                                            <div className="modal-avatar-placeholder">
                                                {userInitials}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`status-indicator ${user.status || 'active'}`}></div>
                                </div>
                                <div className="modal-title-section">
                                    <h2 className="modal-user-name">{user.name}</h2>
                                    <span className={`modal-user-role ${user.role || 'user'}`}>
                                        {(user.role || 'user').toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="modal-content-scroll" data-lenis-prevent>
                                <div className="modal-section">
                                    <h3 className="section-title">Contact Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <div className="info-icon"><FaEnvelope /></div>
                                            <div className="info-content">
                                                <label>Email Address</label>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaPhone /></div>
                                            <div className="info-content">
                                                <label>Phone Number</label>
                                                <p>{user.phone || user.profile?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3 className="section-title">Professional Details</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <div className="info-icon"><FaBuilding /></div>
                                            <div className="info-content">
                                                <label>Company</label>
                                                <p>{user.profile?.company || user.company || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaBriefcase /></div>
                                            <div className="info-content">
                                                <label>Position</label>
                                                <p>{user.profile?.position || user.position || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaMapMarkerAlt /></div>
                                            <div className="info-content">
                                                <label>Location</label>
                                                <p>{user.profile?.location || user.location || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaShieldAlt /></div>
                                            <div className="info-content">
                                                <label>Department</label>
                                                <p>{user.profile?.department || user.department || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3 className="section-title">Account Activity</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <div className="info-icon"><FaCalendarAlt /></div>
                                            <div className="info-content">
                                                <label>Joined Date</label>
                                                <p>{formatDate(user.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-icon"><FaUser /></div>
                                            <div className="info-content">
                                                <label>Last Login</label>
                                                <p>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {user.profile?.bio && (
                                    <div className="modal-section">
                                        <h3 className="section-title">Bio</h3>
                                        <p className="bio-text">{user.profile.bio}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
