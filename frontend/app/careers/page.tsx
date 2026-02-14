'use client';

import Link from 'next/link';
import PageHeader from '../../components/ui/PageHeader';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaArrowRight, FaCheckCircle, FaUsers, FaRocket, FaHeart, FaSpinner } from 'react-icons/fa';
import '../../styles/careers.css';
import { useGetCareersQuery } from '../../lib/store/api/careersApi';

export default function CareersPage() {
    const { data: careersResponse, isLoading, isError } = useGetCareersQuery();
    const jobs = careersResponse?.data?.filter(job => job.isActive) || [];

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title="Join Our Team"
                    subtitle="Be part of a forward-thinking team dedicated to building world-class technology solutions."
                />
                <section className="section">
                    <div className="container">
                        <div className="loading-state">
                            <FaSpinner className="spinner" />
                            <p>Loading careers...</p>
                        </div>
                    </div>
                </section>
                <style jsx>{`
                    .loading-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem;
                        gap: 1rem;
                        color: var(--text-muted);
                    }
                    .spinner {
                        font-size: 2rem;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageHeader
                    title="Join Our Team"
                    subtitle="Be part of a forward-thinking team dedicated to building world-class technology solutions."
                />
                <section className="section">
                    <div className="container">
                        <div className="error-state">
                            <p>Failed to load careers. Please try again later.</p>
                        </div>
                    </div>
                </section>
                <style jsx>{`
                    .error-state {
                        text-align: center;
                        padding: 4rem;
                        color: var(--text-muted);
                    }
                `}</style>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Join Our Team"
                subtitle="Be part of a forward-thinking team dedicated to building world-class technology solutions. Explore open positions and start your journey with us."
            />

            <section className="section">
                <div className="container">
                    <div className="careers-intro">
                        <div className="careers-stats">
                            <div className="career-stat-card">
                                <div className="career-stat-icon"><FaUsers /></div>
                                <h3>Collaborative Culture</h3>
                                <p>Work with some of the best minds in the industry in a supportive and inclusive environment.</p>
                            </div>
                            <div className="career-stat-card">
                                <div className="career-stat-icon"><FaRocket /></div>
                                <h3>Growth Opportunities</h3>
                                <p>We believe in continuous learning and provide ample opportunities for professional growth.</p>
                            </div>
                            <div className="career-stat-card">
                                <div className="career-stat-icon"><FaHeart /></div>
                                <h3>Work-Life Balance</h3>
                                <p>Flexible schedules and a focus on employee well-being ensure you have a life outside of work.</p>
                            </div>
                        </div>
                    </div>

                    <div className="section-header" style={{ marginTop: '5rem' }}>
                        <span className="section-subtitle">Open Positions</span>
                        <h2 className="section-title">Explore Opportunities</h2>
                    </div>

                    <div className="jobs-list">
                        {jobs.length === 0 ? (
                            <div className="no-jobs">
                                <p>No open positions at the moment. Check back later!</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="job-card glass-card">
                                    <div className="job-card-header">
                                        <div className="job-info-main">
                                            <span className="job-dept-tag">{job.department}</span>
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="job-meta">
                                                <span className="job-meta-item">
                                                    <FaMapMarkerAlt /> {job.location}
                                                </span>
                                                <span className="job-meta-item">
                                                    <FaBriefcase /> {job.experience}
                                                </span>
                                                <span className="job-meta-item">
                                                    <FaClock /> {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="job-apply-btn">
                                            <Link href={job.applyLink || `/contact?position=${encodeURIComponent(job.title)}`} className="btn btn-primary">
                                                Apply Now <FaArrowRight />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="job-card-body">
                                        <div className="job-description">
                                            <h4>Description</h4>
                                            <p>{job.description}</p>
                                        </div>

                                        <div className="job-details-grid">
                                            <div className="job-requirements">
                                                <h4>Requirements</h4>
                                                <ul>
                                                    {(job.requirements || []).map((req, idx) => (
                                                        <li key={idx}><FaCheckCircle /> {req}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="job-benefits">
                                                <h4>Benefits</h4>
                                                <ul>
                                                    {(job.benefits || []).map((benefit, idx) => (
                                                        <li key={idx}><FaCheckCircle /> {benefit}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="careers-footer-cta">
                        <div className="glass-card cta-content">
                            <h3>Didn&apos;t find what you&apos;re looking for?</h3>
                            <p>We&apos;re always looking for talented individuals to join our team. Send your resume to <Link href="mailto:careers@thefortunetech.com">careers@thefortunetech.com</Link> for future consideration.</p>
                            <Link href="/contact" className="btn btn-outline">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .no-jobs {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-muted);
                    background: var(--glass-bg);
                    border-radius: var(--radius-lg);
                }
            `}</style>
        </>
    );
}
