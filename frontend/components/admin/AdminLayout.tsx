'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    FaHome, FaUsers, FaCog, FaChartBar, FaBox, FaEnvelope,
    FaBell, FaSignOutAlt, FaTimes, FaBars, FaSearch, FaSun, FaMoon,
    FaBriefcase, FaIdCard, FaLaptopCode, FaQuoteLeft, FaFileAlt, FaUser, FaNewspaper
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { logOut, selectCurrentUser } from '../../lib/store/slices/authSlice';
import { showSuccessNotification } from '../../lib/store/slices/notificationSlice';
import { useLogoutMutation } from '../../lib/store/api/authApi';
import { getImageUrl } from '../../lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
    { name: 'Services', href: '/admin/services', icon: FaBox },
    { name: 'Portfolio', href: '/admin/portfolio', icon: FaIdCard },
    { name: 'Careers', href: '/admin/careers', icon: FaBriefcase },
    { name: 'Technologies', href: '/admin/technologies', icon: FaLaptopCode },
    { name: 'Testimonials', href: '/admin/testimonials', icon: FaQuoteLeft },
    { name: 'CMS', href: '/admin/cms', icon: FaFileAlt },
    { name: 'Blog', href: '/admin/blog', icon: FaNewspaper },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

export default function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const user = useAppSelector(selectCurrentUser);
    const [logoutApi] = useLogoutMutation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            dispatch(logOut());
            dispatch(showSuccessNotification('Logged out successfully'));
            router.push('/login');
        } catch (err) {
            dispatch(logOut()); // Force logout anyway
            router.push('/login');
        }
    };

    useEffect(() => {
        setIsMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-layout">
            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/admin" className="sidebar-logo">
                        <Image src="/logo.png" alt="Fortune Tech" width={100} height={100} />

                    </Link>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav" data-lenis-prevent>
                    <div className="nav-section">
                        <span className="nav-section-title">Main Menu</span>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`sidebar-nav-link ${pathname === item.href ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    {/* Footer content removed as per request */}
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FaBars />
                        </button>
                        <h1 className="admin-page-title">{pageTitle}</h1>
                    </div>

                    <div className="admin-header-right">
                        <button
                            className="admin-header-btn"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>

                        <Link href="/" className="admin-header-btn" title="Go to Website">
                            <FaHome />
                        </Link>

                        <div className="header-profile-wrapper" ref={profileRef}>
                            <button
                                className={`header-profile-btn ${profileOpen ? 'active' : ''}`}
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="header-profile-avatar">
                                    {isMounted && user?.avatar ? (
                                        <Image
                                            src={getImageUrl(user.avatar)}
                                            alt={user.displayName || 'User'}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {isMounted && (user?.firstName && user?.lastName
                                                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                                                : user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD')}
                                        </div>
                                    )}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="header-dropdown">
                                    <div className="dropdown-header">
                                        <span className="dropdown-name">{user?.displayName || user?.name || 'Administrator'}</span>
                                        <span className="dropdown-role">{user?.role || 'Admin'}</span>
                                    </div>
                                    <Link href="/admin/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                        <FaUser />
                                        <span>My Profile</span>
                                    </Link>
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
