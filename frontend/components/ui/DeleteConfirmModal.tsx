'use client';

import { useEffect, useRef } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    itemName?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    itemName,
}: DeleteConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal delete-confirm-modal" ref={modalRef}>
                {/* Close Button */}
                <button className="modal-close-btn" onClick={onClose} aria-label="Close">
                    <FaTimes />
                </button>

                {/* Icon */}
                <div className="modal-icon delete-icon">
                    <FaExclamationTriangle />
                </div>

                {/* Content */}
                <div className="modal-content">
                    <h2 className="modal-title">{title}</h2>
                    {itemName && (
                        <p className="modal-item-name">
                            <strong>{itemName}</strong>
                        </p>
                    )}
                    <p className="modal-message">{message}</p>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn-cancel"
                        onClick={onClose}
                        autoFocus
                    >
                        {cancelText}
                    </button>
                    <button
                        className="modal-btn modal-btn-delete"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
