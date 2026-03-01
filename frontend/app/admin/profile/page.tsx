'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
    FaSave, FaLock, FaUser, FaEnvelope, FaPhone,
    FaCamera, FaSpinner, FaShieldAlt, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { useGetCurrentUserQuery } from '../../../lib/store/api/authApi';
import {
    useUpdateUserMutation,
    useChangePasswordMutation
} from '../../../lib/store/api/usersApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import {
    showSuccessNotification,
    showErrorNotification
} from '../../../lib/store/slices/notificationSlice';
import { setUser } from '../../../lib/store/slices/authSlice';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/utils';

export default function ProfilePage() {
    const dispatch = useAppDispatch();

    // Fetch current user
    const { data: userResponse, isLoading: isUserLoading, refetch } = useGetCurrentUserQuery();
    const user = userResponse?.data;

    // Mutations
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    // Form States
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        displayName: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: (user as any).phone || (user as any).profile?.phone || '',
                displayName: user.displayName || '',
            });
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData();
        formData.append('firstName', profileData.firstName);
        formData.append('lastName', profileData.lastName);
        formData.append('email', profileData.email);
        formData.append('phone', profileData.phone);
        formData.append('displayName', profileData.displayName);
        formData.append('name', `${profileData.firstName} ${profileData.lastName}`.trim());

        // Folder path for avatar
        formData.append('folder', 'users/avatars');

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const result = await updateProfile({ id: user.id, data: formData }).unwrap();
            if (result.data) {
                // Update global auth state with new user data (including avatar)
                dispatch(setUser(result.data as any));
            }
            dispatch(showSuccessNotification('Profile updated successfully'));
            refetch();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to update profile'));
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            dispatch(showErrorNotification('New passwords do not match'));
            return;
        }

        try {
            await changePassword({
                id: user.id,
                data: {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword
                }
            }).unwrap();
            dispatch(showSuccessNotification('Password changed successfully'));
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to change password'));
        }
    };

    if (isUserLoading) {
        return (
            <AdminLayout pageTitle="Profile Settings">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading profile...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Profile Settings">
            <div className="profile-container">
                <div className="admin-grid-2">
                    {/* Column 1: Profile Information */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">
                                <FaUser style={{ color: 'var(--accent-start)' }} /> Personal Information
                            </h3>
                        </div>
                        <div className="admin-card-body">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="avatar-upload-section">
                                    <div className="avatar-preview-wrapper shadow-lg">
                                        {avatarPreview ? (
                                            <Image
                                                src={avatarFile ? avatarPreview : (avatarPreview?.startsWith('http') || avatarPreview?.startsWith('/uploads/') ? getImageUrl(avatarPreview) : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/users/avtars/${avatarPreview}`)}
                                                alt="Avatar"
                                                width={120}
                                                height={120}
                                                className="profile-avatar-large"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="avatar-placeholder-large">
                                                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                                            </div>
                                        )}
                                        <label htmlFor="avatar-upload" className="avatar-edit-badge" title="Change Avatar">
                                            <FaCamera />
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                hidden
                                            />
                                        </label>
                                    </div>
                                    <div className="avatar-info">
                                        <h4 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.displayName || 'User Profile'}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <span className={`role-badge ${user?.role}`} style={{ alignSelf: 'flex-start' }}>
                                                <FaShieldAlt size={10} style={{ marginRight: '6px' }} /> {user?.role?.replace('_', ' ')}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaEnvelope size={12} /> {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <div className="form-input-wrapper">
                                            <input
                                                name="firstName"
                                                className="form-input form-input-with-icon"
                                                value={profileData.firstName}
                                                onChange={handleProfileChange}
                                                required
                                            />
                                            <FaUser className="form-input-icon" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <div className="form-input-wrapper">
                                            <input
                                                name="lastName"
                                                className="form-input form-input-with-icon"
                                                value={profileData.lastName}
                                                onChange={handleProfileChange}
                                                required
                                            />
                                            <FaUser className="form-input-icon" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Display Name</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="displayName"
                                            className="form-input form-input-with-icon"
                                            value={profileData.displayName}
                                            onChange={handleProfileChange}
                                            placeholder="Public name shown in terminal"
                                        />
                                        <FaUser className="form-input-icon" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="email"
                                            type="email"
                                            className="form-input form-input-with-icon"
                                            value={profileData.email}
                                            required
                                            disabled
                                            title="Email cannot be changed"
                                        />
                                        <FaEnvelope className="form-input-icon" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="phone"
                                            className="form-input form-input-with-icon"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            placeholder="+91 12345 67890"
                                        />
                                        <FaPhone className="form-input-icon" />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full shadow-sm" style={{ marginTop: '1rem', height: '3rem' }} disabled={isUpdating}>
                                    {isUpdating ? <FaSpinner className="spinner" /> : <FaSave />}
                                    {' '}Save Profile Changes
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Column 2: Security / Password */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">
                                <FaShieldAlt style={{ color: 'var(--accent-start)' }} /> Security & Password
                            </h3>
                        </div>
                        <div className="admin-card-body">
                            <div className="security-intro">
                                <p>Ensure your account is using a long, random password to stay secure.</p>
                            </div>


                            <form onSubmit={handleChangePassword}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="currentPassword"
                                            type={showPasswords.current ? 'text' : 'password'}
                                            className="form-input form-input-with-icon has-toggle"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <FaLock className="form-input-icon" />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility('current')}
                                            title={showPasswords.current ? "Hide password" : "Show password"}
                                        >
                                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <hr className="form-divider" />

                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="newPassword"
                                            type={showPasswords.new ? 'text' : 'password'}
                                            className="form-input form-input-with-icon has-toggle"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                        />
                                        <FaLock className="form-input-icon" />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility('new')}
                                            title={showPasswords.new ? "Hide password" : "Show password"}
                                        >
                                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            name="confirmPassword"
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            className="form-input form-input-with-icon has-toggle"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <FaLock className="form-input-icon" />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            title={showPasswords.confirm ? "Hide password" : "Show password"}
                                        >
                                            {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full shadow-sm" style={{ height: '3rem' }} disabled={isChangingPassword}>
                                    {isChangingPassword ? <FaSpinner className="spinner" /> : <FaLock />}
                                    {' '}Update Password
                                </button>
                            </form>

                            <div className="security-footer-info">
                                <p>Your password must be at least 8 characters long and include a mix of letters, numbers and symbols.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}
