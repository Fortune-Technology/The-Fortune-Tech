'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaExclamationCircle } from 'react-icons/fa';
import { useLoginMutation } from '../../lib/store/api/authApi';
import { useAppDispatch } from '../../lib/store/hooks';
import { setCredentials } from '../../lib/store/slices/authSlice';
import { showSuccessNotification, showErrorNotification } from '../../lib/store/slices/notificationSlice';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const [login, { isLoading: isSubmitting }] = useLoginMutation();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const result = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            // Store credentials in Redux
            dispatch(setCredentials({
                user: result.data?.user,
                accessToken: result.data?.accessToken
            }));

            dispatch(showSuccessNotification('Login successful! Welcome back.'));

            // Role-based redirect: admin users to /admin, others to home page
            if (result.data?.user?.role === 'admin' || result.data?.user?.role === 'super_admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Login failed. Please check your credentials.'));
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <Link href="/" className="auth-logo">
                            <Image src="/logo.png" alt="Fortune Tech" width={100} height={100} />
                        </Link>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue to your account</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <FaEnvelope className="form-input-icon" />
                            </div>
                            {errors.email && (
                                <span className="form-error">
                                    <FaExclamationCircle />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="form-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <FaLock className="form-input-icon" />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="form-error">
                                    <FaExclamationCircle />
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {/* Options */}
                        <div className="form-options">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                />
                                <span className="checkbox-label">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="forgot-password-link">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary auth-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span className="auth-divider-line"></span>
                        <span className="auth-divider-text">or continue with</span>
                        <span className="auth-divider-line"></span>
                    </div>

                    {/* Social Login */}
                    <div className="social-login-buttons">
                        <button className="social-login-btn">
                            <FaGoogle />
                            Google
                        </button>
                        <button className="social-login-btn">
                            <FaGithub />
                            GitHub
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="auth-footer">
                        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
