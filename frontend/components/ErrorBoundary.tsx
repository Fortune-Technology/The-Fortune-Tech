/**
 * Error Boundary Component
 * Catches runtime errors in React component tree and displays fallback UI
 * Following React best practices and production resilience principles
 */

'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary that catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by ErrorBoundary:', error, errorInfo);
        }

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // In production, you would send this to an error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Render custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-emoji">
                        ⚠️
                    </div>
                    <h1 className="error-boundary-title">
                        Oops! Something went wrong
                    </h1>
                    <p className="error-boundary-message">
                        We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="error-boundary-btn"
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="error-boundary-details">
                            <summary className="error-boundary-summary">
                                Error Details (Development Only)
                            </summary>
                            <pre className="error-boundary-pre">
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Custom fallback component for more specific error scenarios
 */
export function ErrorFallback({
    title = 'Something went wrong',
    message = 'Please try again later',
    onRetry,
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="error-fallback">
            <div className="error-icon">⚠️</div>
            <h2>{title}</h2>
            <p>{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-primary">
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorBoundary;
