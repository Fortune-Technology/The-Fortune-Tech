'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function FloatingButtons() {
    const pathname = usePathname();
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Hide on admin routes
    const isAdminPage = pathname?.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 300px
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        // Use Lenis for smooth scroll if available
        const lenis = (window as any).lenis;
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            // Fallback to native smooth scroll
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const openWhatsApp = () => {
        // Replace with your WhatsApp number (format: country code + number, no + or spaces)
        const phoneNumber = '1234567890'; // Update this with your actual number
        const message = encodeURIComponent('Hello! I would like to inquire about your services.');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    if (isAdminPage) return null;

    return (
        <div className="floating-buttons">
            {/* WhatsApp Button */}
            <button
                className="floating-btn whatsapp-btn"
                onClick={openWhatsApp}
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
            >
                <FaWhatsapp />
            </button>

            {/* Back to Top Button */}
            <button
                className={`floating-btn back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Back to top"
                title="Back to top"
            >
                <FaArrowUp />
            </button>
        </div>
    );
}
