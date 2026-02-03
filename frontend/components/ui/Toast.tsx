'use client';

/**
 * Toast Notification Component
 * Individual toast notification with auto-dismiss
 */

import { useEffect, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useAppDispatch } from '../../lib/store/hooks';
import { removeNotification, Notification } from '../../lib/store/slices/notificationSlice';

interface ToastProps {
    notification: Notification;
}

const iconMap = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
};

export default function Toast({ notification }: ToastProps) {
    const dispatch = useAppDispatch();
    const Icon = iconMap[notification.type];

    const handleClose = useCallback(() => {
        dispatch(removeNotification(notification.id));
    }, [dispatch, notification.id]);

    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(handleClose, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification.duration, handleClose]);

    return (
        <div className={`toast toast-${notification.type}`} role="alert">
            <div className="toast-icon">
                <Icon />
            </div>
            <div className="toast-content">
                {notification.title && <div className="toast-title">{notification.title}</div>}
                <div className="toast-message">{notification.message}</div>
            </div>
            <button className="toast-close" onClick={handleClose} aria-label="Close notification">
                <FaTimes />
            </button>

            <style jsx>{`
                .toast {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: var(--primary-light);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    border-left: 4px solid;
                    animation: slideIn 0.3s ease-out;
                    min-width: 320px;
                    max-width: 450px;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .toast-success {
                    border-left-color: #10b981;
                }
                .toast-success .toast-icon {
                    color: #10b981;
                }

                .toast-error {
                    border-left-color: #ef4444;
                }
                .toast-error .toast-icon {
                    color: #ef4444;
                }

                .toast-warning {
                    border-left-color: #f59e0b;
                }
                .toast-warning .toast-icon {
                    color: #f59e0b;
                }

                .toast-info {
                    border-left-color: #3b82f6;
                }
                .toast-info .toast-icon {
                    color: #3b82f6;
                }

                .toast-icon {
                    font-size: 1.25rem;
                    flex-shrink: 0;
                    margin-top: 0.125rem;
                }

                .toast-content {
                    flex: 1;
                    min-width: 0;
                }

                .toast-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                    font-size: 0.9375rem;
                }

                .toast-message {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    line-height: 1.5;
                    word-wrap: break-word;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                    font-size: 0.875rem;
                    transition: color 0.2s;
                    flex-shrink: 0;
                }

                .toast-close:hover {
                    color: var(--text-primary);
                }
            `}</style>
        </div>
    );
}
