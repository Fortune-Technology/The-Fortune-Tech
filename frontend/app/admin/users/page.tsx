'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaEye, FaEnvelope, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useChangePasswordMutation,
} from '../../../lib/store/api/usersApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';
import { getImageUrl } from '../../../lib/utils';
import UserDetailsModal from '../../../components/admin/UserDetailsModal';
import ImageUpload from '../../../components/ui/ImageUpload';

interface UserFormData {
    // ...
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: string;
    company: string;
    location: string;
    department: string;
    position: string;
    bio: string;
}

const initialFormData: UserFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'client',
    status: 'active',
    phone: '',
    company: '',
    location: '',
    department: '',
    position: '',
    bio: '',
};

const roles = ['super_admin', 'admin', 'editor', 'client'];
const statuses = ['active', 'inactive', 'suspended'];

export default function UsersPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [viewingUser, setViewingUser] = useState<any>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: usersResponse, isLoading, isError } = useGetUsersQuery();
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const users = usersResponse?.data || [];

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const { data: userDetailResponse } = useGetUserByIdQuery(viewingUserId!, {
        skip: !viewingUserId
    });
    // const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation(); // Not used directly anymore

    const editingUser = editingUserId ? users.find((u: any) => u._id === editingUserId) : null;

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setEditingUserId(user.id);
            setFormData({
                firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
                lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
                email: user.email || '',
                password: '',
                role: user.role || 'client',
                status: user.status || 'active',
                phone: user.phone || user.profile?.phone || '',
                company: user.profile?.company || '',
                location: user.profile?.location || '',
                department: user.profile?.department || '',
                position: user.profile?.position || '',
                bio: user.profile?.bio || '',
            });
            setExistingAvatarUrl(user.avatar || null);
        } else {
            setEditingUserId(null);
            setFormData(initialFormData);
            setExistingAvatarUrl(null);
        }
        setAvatarFile(null);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (userId: string) => {
        setViewingUserId(userId);
        setIsDetailOpen(true);
    };

    const handleCloseModals = () => {
        setIsModalOpen(false);
        setIsDetailOpen(false);
        setEditingUserId(null);
        setViewingUserId(null);
        setViewingUser(null);
        setFormData(initialFormData);
        setAvatarFile(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // File handler replaced by ImageUpload component handler directly in JSX

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('company', formData.company);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('department', formData.department);
        formDataToSend.append('position', formData.position);
        formDataToSend.append('bio', formData.bio);

        // Folder path
        formDataToSend.append('folder', 'users/avatars');

        if (avatarFile) {
            formDataToSend.append('avatar', avatarFile);
        }

        // For create user, password is required in the main payload
        if (!editingUserId && formData.password) {
            formDataToSend.append('password', formData.password);
        }


        try {
            if (editingUserId) {
                if (formData.password) {
                    formDataToSend.append('password', formData.password);
                }

                await updateUser({ id: editingUserId, data: formDataToSend }).unwrap();

                if (formData.password) {
                    dispatch(showSuccessNotification(`Email sent to ${formData.email} for password reset`));
                } else {
                    dispatch(showSuccessNotification('User updated successfully'));
                }
            } else {
                await createUser(formDataToSend).unwrap();
                dispatch(showSuccessNotification('Email is user created sent for password reset'));
            }
            handleCloseModals();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save user'));
        }
    };

    const handleDelete = (id: string, name: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete User',
            message: 'This action will permanently delete this user account. This cannot be undone.',
            itemName: name,
            onConfirm: async () => {
                try {
                    await deleteUser(id).unwrap();
                    dispatch(showSuccessNotification('User deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete user'));
                }
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Users">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading users...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Users">
                <div className="admin-error">
                    <p>Failed to load users. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Users">
            {/* Header Actions */}
            <div className="admin-card admin-filter-bar">
                <div className="admin-filter-bar-inner">
                    <div className="admin-search-wrapper">
                        <input
                            type="text"
                            className="form-input admin-search-input"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="admin-search-icon" />
                    </div>

                    <select

                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="form-input admin-role-filter"
                    >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary admin-add-btn" onClick={() => handleOpenModal()}>
                        <FaPlus /> Add User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">All Users ({filteredUsers.length})</h3>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id || `user-${index}`}>
                                    <td>
                                        <div className="admin-table-user-cell">
                                            <div className="user-avatar">
                                                {user.avatar ? (
                                                    <img
                                                        src={getImageUrl(user.avatar)}
                                                        alt={user.name}

                                                    />
                                                ) : (
                                                    user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'
                                                )}
                                            </div>
                                            <span className="admin-table-user-name">{user.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-table-email-cell">
                                            <FaEnvelope size={12} className="admin-table-email-icon" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            <FaShieldAlt size={10} /> {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.status}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(user.lastLogin || '')}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action-btn" onClick={() => handleOpenDetail(user.id)} title="View">
                                                <FaEye />
                                            </button>
                                            <button className="table-action-btn" onClick={() => handleOpenModal(user)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDelete(user.id, user.name || 'Unknown')}
                                                title="Delete"
                                                disabled={isDeleting}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="admin-table-empty-row">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingUserId ? 'Edit User' : 'Add User'}</h3>
                            <button className="table-action-btn" onClick={handleCloseModals}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSave} className="admin-form-padded">
                            <div className="admin-grid-2">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input name="firstName" className="form-input" value={formData.firstName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input name="lastName" className="form-input" value={formData.lastName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input name="email" type="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{editingUserId ? 'New Password (leave blank to keep)' : 'Password'}</label>
                                    <div className="admin-password-wrapper">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}

                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!editingUserId}
                                            className="form-input admin-password-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="password-toggle-btn"
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <input name="company" className="form-input" value={formData.company} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input name="location" className="form-input" value={formData.location} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <input name="department" className="form-input" value={formData.department} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Position</label>
                                    <input name="position" className="form-input" value={formData.position} onChange={handleInputChange} />
                                </div>
                                <div className="form-group admin-form-span-2">
                                    <label className="form-label">Bio</label>
                                    <textarea name="bio" className="form-input admin-form-textarea" value={formData.bio} onChange={handleInputChange as any} rows={3} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select name="role" className="form-input" value={formData.role} onChange={handleInputChange}>
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group admin-form-span-2">
                                    <ImageUpload
                                        label="Avatar"
                                        value={avatarFile || existingAvatarUrl}
                                        onChange={(file) => setAvatarFile(file)}
                                        folderPath="users/avatars"
                                        height={200}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModals}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                                    {(isCreating || isUpdating) ? <div className="spinner-sm"></div> : <FaSave />}
                                    {' '}Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium User Details Modal */}
            <UserDetailsModal
                isOpen={isDetailOpen}
                onClose={handleCloseModals}
                user={userDetailResponse?.data}
            />

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
