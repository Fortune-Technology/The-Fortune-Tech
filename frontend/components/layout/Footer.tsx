'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaLinkedin, FaFacebook, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import websiteConfig from '../../data/website-config.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { site, company, social, navigation } = websiteConfig;

  // Don't show footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
            <Link href="/" className="nav-logo footer-logo">
              <Image
                src={site.logo}
                alt={`${site.name} Logo`}
                width={150}
                height={150}
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-text">
              {site.description}
            </p>
            <div className="social-links">
              {social.linkedin && (
                <a href={social.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
              )}
              {social.github && (
                <a href={social.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {navigation.footer.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              {navigation.footer.services.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Get in Touch</h4>
            <ul className="contact-list">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>
                  {company.address.street}, {company.address.city}, {company.address.state} {company.address.zipCode}
                </span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>{company.contact.phone}</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>{company.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} {site.name}. All rights reserved. Built with ❤️ for innovation.</p>
            <div className="footer-legal-links">
              {navigation.footer.legal.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
