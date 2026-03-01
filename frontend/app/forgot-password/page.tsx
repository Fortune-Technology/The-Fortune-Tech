'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaExclamationCircle, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useForgotPasswordMutation } from '../../lib/store/api/authApi';
import { useAppDispatch } from '../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../lib/store/slices/notificationSlice';

export default function ForgotPasswordPage() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [forgotPassword, { isLoading: isSubmitting }] = useForgotPasswordMutation();

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await forgotPassword({ email }).unwrap();
            setIsSuccess(true);
            dispatch(showSuccessNotification('Password reset link sent to your email.'));
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to send reset link. Please try again.'));
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link href="/login" className="back-link">
                    <FaArrowLeft />
                    Back to Login
                </Link>

                <div className="auth-card">
                    {!isSuccess ? (
                        <>
                            {/* Header */}
                            <div className="auth-header">
                                <Link href="/" className="auth-logo">
                                    <Image src="/logo.png" alt="Fortune Tech" width={100} height={100} />

                                </Link>
                                <h1 className="auth-title">Forgot Password?</h1>
                                <p className="auth-subtitle">
                                    No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form className="auth-form" onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="email"
                                            className={`form-input ${error ? 'error' : ''}`}
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <FaEnvelope className="form-input-icon" />
                                    </div>
                                    {error && (
                                        <span className="form-error">
                                            <FaExclamationCircle />
                                            {error}
                                        </span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary auth-submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="auth-footer">
                                Remember your password? <Link href="/login">Sign in</Link>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div className="success-message">
                            <div className="success-icon">
                                <FaCheckCircle />
                            </div>
                            <h2 className="success-title">Check Your Email</h2>
                            <p className="success-text">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions.
                            </p>
                            <Link href="/login" className="btn btn-primary auth-submit-btn">
                                Back to Login
                            </Link>
                            <p className="auth-footer auth-footer-spaced">
                                Didn&apos;t receive the email?{' '}
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="forgot-password-link"
                                    className="auth-resend-btn"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
