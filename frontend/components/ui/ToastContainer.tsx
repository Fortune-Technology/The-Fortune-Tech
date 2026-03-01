'use client';

/**
 * Toast Container Component
 * Renders all active notifications from Redux state
 */

import { useAppSelector } from '../../lib/store/hooks';
import { selectNotifications } from '../../lib/store/slices/notificationSlice';
import Toast from './Toast';

export default function ToastContainer() {
    const notifications = useAppSelector(selectNotifications);

    if (notifications.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
            {notifications.map((notification) => (
                <Toast key={notification.id} notification={notification} />
            ))}

            <style jsx>{`
                .toast-container {
                    position: fixed;
                    top: 1.5rem;
                    right: 1.5rem;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    pointer-events: none;
                }

                .toast-container :global(.toast) {
                    pointer-events: auto;
                }

                @media (max-width: 480px) {
                    .toast-container {
                        left: 1rem;
                        right: 1rem;
                        top: 1rem;
                    }
                    
                    .toast-container :global(.toast) {
                        min-width: auto;
                        max-width: none;
                    }
                }
            `}</style>
        </div>
    );
}
