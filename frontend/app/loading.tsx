/**
 * Loading UI Component
 * Displayed during page transitions and Suspense boundaries
 */

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="spinner-wrapper">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
}
