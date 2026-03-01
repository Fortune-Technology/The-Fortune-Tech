'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle, FaSave, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaCamera, FaTimes } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../lib/store/hooks';
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading, setUser } from '../../lib/store/slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation, useChangeProfilePasswordMutation } from '../../lib/store/api/profileApi';
import { showSuccessNotification, showErrorNotification } from '../../lib/store/slices/notificationSlice';

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isAuthLoading = useAppSelector(selectAuthLoading);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not authenticated — but ONLY after auth check is complete
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isAuthLoading, router]);

    // API hooks
    const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangeProfilePasswordMutation();

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        bio: '',
        phone: '',
        location: '',
        company: '',
        position: '',
    });

    // Avatar state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    // Populate profile form when data loads
    useEffect(() => {
        if (profileData?.data) {
            const p = profileData.data;
            setProfileForm({
                firstName: p.firstName || '',
                lastName: p.lastName || '',
                displayName: p.displayName || '',
                bio: p.profile?.bio || '',
                phone: p.profile?.phone || '',
                location: p.profile?.location || '',
                company: p.profile?.company || '',
                position: p.profile?.position || '',
            });
            // Set existing avatar as preview
            if (p.avatar) {
                setAvatarPreview(p.avatar);
            }
        } else if (user) {
            setProfileForm(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                displayName: user.displayName || '',
            }));
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [profileData, user]);

    // Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            dispatch(showErrorNotification('Please select a valid image file'));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            dispatch(showErrorNotification('Image size must be less than 5MB'));
            return;
        }

        setAvatarFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Remove avatar
    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Get user initials for avatar placeholder
    const getInitials = () => {
        const fn = profileForm.firstName || user?.firstName || '';
        const ln = profileForm.lastName || user?.lastName || '';
        if (fn && ln) return `${fn[0]}${ln[0]}`.toUpperCase();
        if (user?.name) {
            const parts = user.name.split(' ');
            return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || '?';
    };

    // Profile form validation
    const validateProfile = () => {
        const errors: Record<string, string> = {};
        if (!profileForm.firstName.trim()) errors.firstName = 'First name is required';
        if (!profileForm.lastName.trim()) errors.lastName = 'Last name is required';
        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Password form validation
    const validatePassword = () => {
        const errors: Record<string, string> = {};
        if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
        if (!passwordForm.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters';
        }
        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = 'Confirm password is required';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle profile update
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProfile()) return;

        try {
            const formData = new FormData();
            Object.entries(profileForm).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            // Append avatar file if selected
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const result = await updateProfile(formData).unwrap();

            if (result.success && result.data) {
                // Update the user in Redux store
                dispatch(setUser({
                    id: result.data.id || user?.id || '',
                    email: result.data.email || user?.email || '',
                    name: result.data.name || `${profileForm.firstName} ${profileForm.lastName}`,
                    firstName: result.data.firstName || profileForm.firstName,
                    lastName: result.data.lastName || profileForm.lastName,
                    displayName: result.data.displayName || profileForm.displayName,
                    role: result.data.role || user?.role || 'user',
                    avatar: result.data.avatar || user?.avatar,
                }));

                // Clear the file input after successful upload
                setAvatarFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }

            dispatch(showSuccessNotification(result.message || 'Profile updated successfully'));
        } catch (err: unknown) {
            const error = err as { data?: { message?: string } };
            dispatch(showErrorNotification(error?.data?.message || 'Failed to update profile'));
        }
    };

    // Handle password change
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            const result = await changePassword(passwordForm).unwrap();
            dispatch(showSuccessNotification(result.message || 'Password changed successfully'));
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordErrors({});
        } catch (err: unknown) {
            const error = err as { data?: { message?: string } };
            dispatch(showErrorNotification(error?.data?.message || 'Failed to change password'));
        }
    };

    if (!isAuthenticated || isAuthLoading) return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-loading">
                    <div className="loading-spinner" />
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    );

    if (isProfileLoading) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-loading">
                        <div className="loading-spinner" />
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">Manage your personal information and account security</p>
                </div>
            </div>

            <div className="container">
                <div className="profile-content">
                    {/* Left Section - User Information */}
                    <div className="profile-section profile-info-section">
                        <div className="profile-section-header">
                            <div className="profile-section-icon">
                                <FaUser />
                            </div>
                            <div>
                                <h2 className="profile-section-title">Personal Information</h2>
                                <p className="profile-section-subtitle">Update your personal details and photo</p>
                            </div>
                        </div>

                        <form className="profile-form" onSubmit={handleProfileSubmit}>
                            {/* Avatar Upload Section */}
                            <div className="avatar-upload-section">
                                <div className="avatar-upload-container">
                                    <div className="avatar-upload-preview">
                                        {avatarPreview ? (
                                            <Image
                                                src={avatarPreview}
                                                alt="Profile Avatar"
                                                width={120}
                                                height={120}
                                                className="avatar-upload-img"
                                                unoptimized={avatarPreview.startsWith('data:')}
                                            />
                                        ) : (
                                            <span className="avatar-upload-initials">{getInitials()}</span>
                                        )}
                                        <button
                                            type="button"
                                            className="avatar-upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            aria-label="Upload avatar"
                                        >
                                            <FaCamera />
                                        </button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="avatar-file-input"
                                    />
                                    <div className="avatar-upload-info">
                                        <p className="avatar-upload-name">
                                            {profileForm.firstName || 'Your'} {profileForm.lastName || 'Name'}
                                        </p>
                                        <p className="avatar-upload-hint">
                                            Click the camera icon to upload a photo
                                        </p>
                                        <p className="avatar-upload-size">JPG, PNG or GIF. Max 5MB</p>
                                        {avatarFile && (
                                            <button
                                                type="button"
                                                className="avatar-remove-btn"
                                                onClick={handleRemoveAvatar}
                                            >
                                                <FaTimes size={12} />
                                                Remove photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Name Row */}
                            <div className="profile-form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            className={`form-input ${profileErrors.firstName ? 'error' : ''}`}
                                            placeholder="Enter first name"
                                            value={profileForm.firstName}
                                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                        />
                                        <FaUser className="form-input-icon" />
                                    </div>
                                    {profileErrors.firstName && (
                                        <span className="form-error">
                                            <FaExclamationCircle />
                                            {profileErrors.firstName}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            className={`form-input ${profileErrors.lastName ? 'error' : ''}`}
                                            placeholder="Enter last name"
                                            value={profileForm.lastName}
                                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                        />
                                        <FaUser className="form-input-icon" />
                                    </div>
                                    {profileErrors.lastName && (
                                        <span className="form-error">
                                            <FaExclamationCircle />
                                            {profileErrors.lastName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email (disabled) */}
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="email"
                                        className="form-input disabled-input"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                    <FaEnvelope className="form-input-icon" />
                                </div>
                                <span className="form-hint">
                                    <FaLock size={10} />
                                    Email cannot be changed
                                </span>
                            </div>

                            {/* Display Name */}
                            <div className="form-group">
                                <label className="form-label">Display Name</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="How you want to be displayed"
                                        value={profileForm.displayName}
                                        onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                                    />
                                    <FaUser className="form-input-icon" />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="Enter phone number"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    />
                                    <FaPhone className="form-input-icon" />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="City, Country"
                                        value={profileForm.location}
                                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                    />
                                    <FaMapMarkerAlt className="form-input-icon" />
                                </div>
                            </div>

                            {/* Company & Position row */}
                            <div className="profile-form-row">
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Company name"
                                            value={profileForm.company}
                                            onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                                        />
                                        <FaBuilding className="form-input-icon" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Position</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Job title"
                                            value={profileForm.position}
                                            onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                                        />
                                        <FaBriefcase className="form-input-icon" />
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="form-group">
                                <label className="form-label">Bio</label>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary profile-submit-btn"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="btn-spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave size={14} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Section - Change Password */}
                    <div className="profile-section profile-password-section">
                        <div className="profile-section-header">
                            <div className="profile-section-icon">
                                <FaLock />
                            </div>
                            <div>
                                <h2 className="profile-section-title">Change Password</h2>
                                <p className="profile-section-subtitle">Update your account password</p>
                            </div>
                        </div>

                        <form className="profile-form" onSubmit={handlePasswordSubmit}>
                            {/* Current Password */}
                            <div className="form-group">
                                <label className="form-label">Old Password</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                                        placeholder="Enter current password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    />
                                    <FaLock className="form-input-icon" />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    >
                                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                    <span className="form-error">
                                        <FaExclamationCircle />
                                        {passwordErrors.currentPassword}
                                    </span>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                                        placeholder="Enter new password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    />
                                    <FaLock className="form-input-icon" />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    >
                                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <span className="form-error">
                                        <FaExclamationCircle />
                                        {passwordErrors.newPassword}
                                    </span>
                                )}
                                {passwordForm.newPassword && passwordForm.newPassword.length >= 8 && (
                                    <span className="form-success-hint">
                                        <FaCheckCircle size={12} />
                                        Password meets requirements
                                    </span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Confirm new password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    />
                                    <FaLock className="form-input-icon" />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <span className="form-error">
                                        <FaExclamationCircle />
                                        {passwordErrors.confirmPassword}
                                    </span>
                                )}
                                {passwordForm.confirmPassword &&
                                    passwordForm.newPassword === passwordForm.confirmPassword &&
                                    passwordForm.newPassword.length >= 8 && (
                                        <span className="form-success-hint">
                                            <FaCheckCircle size={12} />
                                            Passwords match
                                        </span>
                                    )}
                            </div>

                            {/* Password Requirements */}
                            <div className="password-requirements">
                                <p className="password-requirements-title">Password Requirements:</p>
                                <ul className="password-requirements-list">
                                    <li className={passwordForm.newPassword.length >= 8 ? 'met' : ''}>
                                        Minimum 8 characters
                                    </li>
                                    <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'met' : ''}>
                                        At least one uppercase letter
                                    </li>
                                    <li className={/[0-9]/.test(passwordForm.newPassword) ? 'met' : ''}>
                                        At least one number
                                    </li>
                                    <li className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'met' : ''}>
                                        At least one special character
                                    </li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary profile-submit-btn"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? (
                                    <>
                                        <span className="btn-spinner" />
                                        Changing...
                                    </>
                                ) : (
                                    <>
                                        <FaLock size={14} />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
