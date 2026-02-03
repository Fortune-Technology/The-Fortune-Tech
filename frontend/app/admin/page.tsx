'use client';

import AdminLayout from '../../components/admin/AdminLayout';
import {
    FaUsers, FaArrowUp, FaArrowDown, FaUser, FaExclamationTriangle,
    FaBriefcase, FaProjectDiagram, FaServicestack, FaQuoteLeft, FaSpinner
} from 'react-icons/fa';
import { useGetUsersQuery } from '../../lib/store/api/usersApi';
import { useGetPortfoliosQuery } from '../../lib/store/api/portfolioApi';
import { useGetServicesQuery } from '../../lib/store/api/servicesApi';
import { useGetCareersQuery } from '../../lib/store/api/careersApi';
import { useGetTestimonialsQuery } from '../../lib/store/api/testimonialsApi';
import Link from 'next/link';

const getRelativeTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
};

export default function AdminDashboard() {
    // RTK Query hooks
    const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery();
    const { data: portfolioResponse, isLoading: isLoadingPortfolio } = useGetPortfoliosQuery();
    const { data: servicesResponse, isLoading: isLoadingServices } = useGetServicesQuery();
    const { data: careersResponse, isLoading: isLoadingCareers } = useGetCareersQuery();
    const { data: testimonialsResponse, isLoading: isLoadingTestimonials } = useGetTestimonialsQuery();

    const users = usersResponse?.data || [];
    const portfolios = portfolioResponse?.data || [];
    const services = servicesResponse?.data || [];
    const careers = careersResponse?.data || [];
    const testimonials = testimonialsResponse?.data || [];

    const isLoading = isLoadingUsers || isLoadingPortfolio || isLoadingServices || isLoadingCareers || isLoadingTestimonials;

    const activeUsers = users.filter(u => u.status === 'active');
    const activePositions = careers.filter(c => c.isActive);

    const stats = [
        {
            label: 'Total Users',
            value: users.length.toString(),
            change: '+12.5%',
            positive: true,
            icon: FaUsers,
            color: 'purple',
            link: '/admin/users'
        },
        {
            label: 'Active Users',
            value: activeUsers.length.toString(),
            change: '+5.2%',
            positive: true,
            icon: FaUser,
            color: 'green',
            link: '/admin/users'
        },
        {
            label: 'Total Projects',
            value: portfolios.length.toString(),
            change: '+2',
            positive: true,
            icon: FaProjectDiagram,
            color: 'blue',
            link: '/admin/portfolio'
        },
        {
            label: 'Services',
            value: services.length.toString(),
            change: '+1',
            positive: true,
            icon: FaServicestack,
            color: 'orange',
            link: '/admin/services'
        },
        {
            label: 'Open Positions',
            value: activePositions.length.toString(),
            change: 'New',
            positive: true,
            icon: FaBriefcase,
            color: 'cyan',
            link: '/admin/careers'
        },
        {
            label: 'Testimonials',
            value: testimonials.length.toString(),
            change: '+4.1%',
            positive: true,
            icon: FaQuoteLeft,
            color: 'pink',
            link: '/admin/testimonials'
        }
    ];

    const recentUsers = users.slice(0, 5).map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status || 'active',
        role: user.role || 'user',
        role: user.role || 'user',
        joined: getRelativeTime(user.lastLogin || user.createdAt),
        avatar: user.avatar
    }));

    return (
        <AdminLayout pageTitle="Dashboard">
            {isLoading && (
                <div className="loading-overlay">
                    <FaSpinner className="spinner" />
                    <p>Loading dashboard data...</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <Link href={stat.link} key={stat.label} className="stat-card">
                        <div className="stat-info">
                            <span className="stat-info-label">{stat.label}</span>
                            <span className="stat-info-value">
                                {isLoading ? '-' : stat.value}
                            </span>
                            <span className={`stat-info-change ${stat.positive ? 'positive' : 'negative'}`}>
                                {stat.positive ? <FaArrowUp /> : <FaArrowDown />}
                                {stat.change}
                            </span>
                        </div>
                        <div className={`stat-icon ${stat.color}`}>
                            <stat.icon />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Users Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Recent Users</h3>
                    <div className="admin-card-actions">
                        <Link href="/admin/users" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            View All
                        </Link>
                    </div>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                                <th>Role</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingUsers ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <FaSpinner className="spinner" /> Loading...
                                    </td>
                                </tr>
                            ) : recentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                recentUsers.map((user, index) => (
                                    <tr key={user.id || `user-${index}`}>
                                        <td>
                                            <div className="table-user">
                                                <div className="table-user-avatar">
                                                    {user.avatar ? (
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`}
                                                            alt={user.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'
                                                    )}
                                                </div>
                                                <div className="table-user-info">
                                                    <span className="table-user-name">{user.name}</span>
                                                    <span className="table-user-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.status}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                                        <td>{user.joined}</td>
                                        <td>
                                            <div className="table-actions">
                                                <Link href={`/admin/users?edit=${user.id}`} className="table-action-btn" title="Edit">
                                                    <FaUser />
                                                </Link>
                                                <button className="table-action-btn delete" title="View Details">
                                                    <FaExclamationTriangle />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="admin-pagination">
                    <span className="pagination-info">
                        Showing {recentUsers.length} of {users.length} users
                    </span>
                </div>
            </div>

        </AdminLayout>
    );
}
