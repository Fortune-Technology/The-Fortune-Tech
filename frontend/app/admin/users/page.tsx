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
        } else {
            setEditingUserId(null);
            setFormData(initialFormData);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

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
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        <FaSearch style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} />
                    </div>

                    <select
                        className="form-input"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '130px' }}
                    >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ marginLeft: 'auto' }}>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="user-avatar">
                                                {user.avatar ? (
                                                    <img
                                                        src={getImageUrl(user.avatar)}
                                                        alt={user.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'
                                                )}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{user.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FaEnvelope size={12} style={{ color: 'var(--text-muted)' }} />
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
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
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
                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
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
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className="form-input"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!editingUserId}
                                            style={{ paddingRight: '2.5rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '0.75rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)'
                                            }}
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
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Bio</label>
                                    <textarea name="bio" className="form-input" value={formData.bio} onChange={handleInputChange as any} rows={3} style={{ resize: 'vertical' }} />
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
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Avatar</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        {/* Current Avatar */}
                                        {editingUser && editingUser.avatar && !avatarFile && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                                                    <img
                                                        src={getImageUrl(editingUser.avatar)}
                                                        alt="Current"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current</span>
                                            </div>
                                        )}
                                        {/* New Avatar Preview */}
                                        {avatarFile && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--primary-color)', marginBottom: '0.25rem' }}>
                                                    <img
                                                        src={URL.createObjectURL(avatarFile)}
                                                        alt="New"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>New</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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
