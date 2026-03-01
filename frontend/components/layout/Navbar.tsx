'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaSun, FaMoon, FaUser, FaUserPlus, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import websiteConfig from '../../data/website-config.json';
import { useScrolled } from '../../lib/hooks';
import { useAppSelector, useAppDispatch } from '../../lib/store/hooks';
import { selectCurrentUser, selectIsAuthenticated, logOut } from '../../lib/store/slices/authSlice';
import { useLogoutMutation } from '../../lib/store/api/authApi';
import { baseApi } from '../../lib/store/api/baseApi';
import { showSuccessNotification, showErrorNotification } from '../../lib/store/slices/notificationSlice';

// Extract nav links at module level - static data that doesn't change
const navLinks = websiteConfig.navigation.main.map(item => ({
    name: item.label,
    href: item.href
}));

// Site config extracted once
const { site } = websiteConfig;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const scrolled = useScrolled(20);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [logout] = useLogoutMutation();

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Memoized toggle function to prevent unnecessary re-renders
    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsOpen(false), []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setDropdownOpen(false);
        setIsOpen(false);
        try {
            await logout().unwrap();
            dispatch(logOut());
            dispatch(baseApi.util.resetApiState());
            dispatch(showSuccessNotification('Logged out successfully'));
            router.push('/');
        } catch {
            // Even if API call fails, clear local state
            dispatch(logOut());
            dispatch(baseApi.util.resetApiState());
            dispatch(showErrorNotification('Logged out'));
            router.push('/');
        }
    };

    // Generate user avatar initials
    const getInitials = () => {
        if (!user) return '?';
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        if (user.name) {
            const parts = user.name.split(' ');
            return parts.length > 1
                ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                : parts[0][0].toUpperCase();
        }
        return user.email?.[0]?.toUpperCase() || '?';
    };

    const getDisplayName = () => {
        if (!user) return '';
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.displayName) return user.displayName;
        if (user.name) return user.name;
        return user.email;
    };

    // Don't show navbar on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link href="/" className="nav-logo" onClick={closeMenu}>
                    <Image
                        src={site.logo}
                        alt={`${site.name} Logo`}
                        width={150}
                        height={150}
                        className="nav-logo-img"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="nav-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
                    </button>

                    {isAuthenticated && user ? (
                        /* User Avatar & Dropdown */
                        <div className="nav-user-menu" ref={dropdownRef}>
                            <button
                                className="nav-user-trigger"
                                onClick={() => setDropdownOpen(prev => !prev)}
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="nav-user-avatar">
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={getDisplayName()}
                                            width={36}
                                            height={36}
                                            className="nav-avatar-img"
                                        />
                                    ) : (
                                        <span className="nav-avatar-initials">{getInitials()}</span>
                                    )}
                                </div>
                                <span className="nav-user-name">{getDisplayName()}</span>
                                <FaChevronDown
                                    size={12}
                                    className={`nav-user-chevron ${dropdownOpen ? 'rotated' : ''}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="nav-dropdown">
                                    <div className="nav-dropdown-header">
                                        <div className="nav-dropdown-avatar">
                                            {user.avatar ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={getDisplayName()}
                                                    width={44}
                                                    height={44}
                                                    className="nav-avatar-img"
                                                />
                                            ) : (
                                                <span className="nav-avatar-initials">{getInitials()}</span>
                                            )}
                                        </div>
                                        <div className="nav-dropdown-info">
                                            <span className="nav-dropdown-name">{getDisplayName()}</span>
                                            <span className="nav-dropdown-email">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="nav-dropdown-divider" />
                                    <Link href="/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <FaUser size={14} />
                                        <span>My Profile</span>
                                    </Link>
                                    <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                                        <FaSignOutAlt size={14} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login / Sign Up Buttons */
                        <>
                            <Link href="/login" className="btn btn-ghost nav-auth-btn">
                                <FaUser size={14} />
                                <span>Login</span>
                            </Link>
                            <Link href="/signup" className="btn btn-primary nav-auth-btn">
                                <FaUserPlus size={14} />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
                    </button>

                    {/* Mobile User Avatar (if logged in) */}
                    {isAuthenticated && user && (
                        <button
                            className="nav-user-avatar mobile-avatar-btn"
                            onClick={toggleMenu}
                            aria-label="Open menu"
                        >
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={getDisplayName()}
                                    width={36}
                                    height={36}
                                    className="nav-avatar-img"
                                />
                            ) : (
                                <span className="nav-avatar-initials">{getInitials()}</span>
                            )}
                        </button>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="mobile-menu">
                        {/* Mobile user info header (if logged in) */}
                        {isAuthenticated && user && (
                            <div className="mobile-user-info">
                                <div className="nav-user-avatar mobile-menu-avatar">
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={getDisplayName()}
                                            width={44}
                                            height={44}
                                            className="nav-avatar-img"
                                        />
                                    ) : (
                                        <span className="nav-avatar-initials">{getInitials()}</span>
                                    )}
                                </div>
                                <div className="mobile-user-details">
                                    <span className="mobile-user-name">{getDisplayName()}</span>
                                    <span className="mobile-user-email">{user.email}</span>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mobile-auth-buttons">
                            {isAuthenticated && user ? (
                                <>
                                    <Link href="/profile" className="btn btn-outline mobile-auth-btn" onClick={closeMenu}>
                                        <FaUser size={14} />
                                        <span>My Profile</span>
                                    </Link>
                                    <button className="btn btn-danger mobile-auth-btn" onClick={handleLogout}>
                                        <FaSignOutAlt size={14} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="btn btn-outline mobile-auth-btn" onClick={closeMenu}>
                                        <FaUser size={14} />
                                        <span>Login</span>
                                    </Link>
                                    <Link href="/signup" className="btn btn-primary mobile-auth-btn" onClick={closeMenu}>
                                        <FaUserPlus size={14} />
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
}
