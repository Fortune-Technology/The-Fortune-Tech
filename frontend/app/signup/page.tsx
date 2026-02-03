'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaExclamationCircle, FaUser } from 'react-icons/fa';
import { useRegisterMutation } from '../../lib/store/api/authApi';
import { useAppDispatch } from '../../lib/store/hooks';
import { setCredentials } from '../../lib/store/slices/authSlice';
import { showSuccessNotification, showErrorNotification } from '../../lib/store/slices/notificationSlice';

export default function SignupPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [register, { isLoading: isSubmitting }] = useRegisterMutation();

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        const password = formData.password;
        if (!password) return { level: 0, text: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        if (strength <= 1) return { level: 1, text: 'Weak password' };
        if (strength === 2) return { level: 2, text: 'Medium strength' };
        if (strength === 3) return { level: 3, text: 'Strong password' };
        return { level: 4, text: 'Very strong password' };
    }, [formData.password]);

    const getStrengthClass = (barIndex: number) => {
        if (passwordStrength.level === 0) return '';
        if (passwordStrength.level === 1 && barIndex === 1) return 'weak';
        if (passwordStrength.level === 2 && barIndex <= 2) return 'medium';
        if (passwordStrength.level >= 3 && barIndex <= passwordStrength.level) return 'strong';
        return '';
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            }).unwrap();

            // Store credentials in Redux
            dispatch(setCredentials({
                user: result.data?.user,
                accessToken: result.data?.accessToken
            }));

            dispatch(showSuccessNotification('Account created successfully! Welcome aboard.'));

            // Role-based redirect: admin users to /admin, others to home page
            if (result.data?.user?.role === 'admin' || result.data?.user?.role === 'super_admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Registration failed. Please try again.'));
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
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join us and start your journey today</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Name Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                    <FaUser className="form-input-icon" />
                                </div>
                                {errors.firstName && (
                                    <span className="form-error">
                                        <FaExclamationCircle />
                                        {errors.firstName}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                    <FaUser className="form-input-icon" />
                                </div>
                                {errors.lastName && (
                                    <span className="form-error">
                                        <FaExclamationCircle />
                                        {errors.lastName}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="john@example.com"
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
                                    placeholder="Create a strong password"
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
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bars">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`strength-bar ${getStrengthClass(i)}`}></div>
                                        ))}
                                    </div>
                                    <span className={`strength-text ${passwordStrength.level <= 1 ? 'weak' : passwordStrength.level === 2 ? 'medium' : 'strong'}`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                            {errors.password && (
                                <span className="form-error">
                                    <FaExclamationCircle />
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="form-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <FaLock className="form-input-icon" />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="form-error">
                                    <FaExclamationCircle />
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div className="form-group">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                />
                                <span className="checkbox-label">
                                    I agree to the <Link href="/terms-and-conditions" className="forgot-password-link">Terms & Conditions</Link> and{' '}
                                    <Link href="/privacy-policy" className="forgot-password-link">Privacy Policy</Link>
                                </span>
                            </label>
                            {errors.agreeTerms && (
                                <span className="form-error">
                                    <FaExclamationCircle />
                                    {errors.agreeTerms}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary auth-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account? <Link href="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
