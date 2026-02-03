'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import { getImageUrl } from '../../../lib/utils';
import { useGetPortfolioByIdQuery, useGetPortfoliosQuery } from '../../../lib/store/api/portfolioApi';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCheck, FaClock, FaMapMarkerAlt, FaIndustry, FaChartLine, FaSpinner, FaFileAlt } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiPython, SiPostgresql, SiRedis, SiDocker, SiFirebase, SiStripe, SiMongodb, SiFigma } from 'react-icons/si';
import { FaReact, FaNodeJs, FaAws } from 'react-icons/fa';

// Helper to get tech icon
const getTechIcon = (tech: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
        'Next.js': SiNextdotjs,
        'TypeScript': SiTypescript,
        'Python': SiPython,
        'FastAPI': SiPython,
        'PostgreSQL': SiPostgresql,
        'Redis': SiRedis,
        'AWS': FaAws,
        'Docker': SiDocker,
        'React': FaReact,
        'React Native': FaReact,
        'Node.js': FaNodeJs,
        'Express': FaNodeJs,
        'Firebase': SiFirebase,
        'Firebase Functions': SiFirebase,
        'Firestore': SiFirebase,
        'Stripe': SiStripe,
        'MongoDB': SiMongodb,
        'Figma': SiFigma,
        'D3.js': FaReact,
    };
    return iconMap[tech] || null;
};

// Status badge color
const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'status-completed';
        case 'live':
            return 'status-live';
        case 'in-progress':
            return 'status-progress';
        default:
            return 'status-default';
    }
};

// Helper to check if object has values
const hasObjectData = (obj: unknown): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.keys(obj).length > 0 && Object.values(obj).some(v => v !== undefined && v !== null && v !== '');
};

export default function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    // Fetch portfolio by slug
    const { data: portfolioResponse, isLoading, isError } = useGetPortfolioByIdQuery(slug);
    const project = portfolioResponse?.data;

    // Fetch all portfolios for related projects
    const { data: portfoliosResponse } = useGetPortfoliosQuery();
    const allProjects = portfoliosResponse?.data || [];

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title="Loading..."
                    subtitle="Please wait while we load the project details"
                />
                <section className="section">
                    <div className="container">
                        <div className="loading-state">
                            <FaSpinner className="spinner" />
                            <p>Loading project details...</p>
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

    if (isError || !project) {
        notFound();
    }

    // Get client info safely - client can be object with name/location
    const clientData = project.client;
    const clientName = clientData && typeof clientData === 'object'
        ? (clientData as { name?: string }).name || 'N/A'
        : (clientData as string) || 'N/A';
    const clientLocation = clientData && typeof clientData === 'object'
        ? (clientData as { location?: string }).location || ''
        : '';

    // Get links safely - links is an object with live, github, caseStudy
    const links = project.links || {};
    const liveLink = typeof links === 'object' ? (links as { live?: string }).live : null;
    const githubLink = typeof links === 'object' ? (links as { github?: string }).github : null;
    const caseStudyLink = typeof links === 'object' ? (links as { caseStudy?: string }).caseStudy : null;

    // Find related projects (same category, excluding current)
    const relatedProjects = allProjects
        .filter((p) => p.id !== project.id && p.category === project.category)
        .slice(0, 2);

    // Check if techStack has data - it can be an object or array
    const hasTechStack = project.techStack && (
        (Array.isArray(project.techStack) && project.techStack.length > 0) ||
        (typeof project.techStack === 'object' && hasObjectData(project.techStack))
    );

    // Check if metrics has data
    const hasMetrics = project.metrics && hasObjectData(project.metrics);

    return (
        <>
            <PageHeader
                title={project.title}
                subtitle={project.description}
            />

            <section className="section">
                <div className="container">
                    {/* Back Button */}
                    <Link href="/portfolio" className="back-link">
                        <FaArrowLeft /> Back to Portfolio
                    </Link>

                    {/* Project Hero */}
                    <div className="project-detail-hero">
                        <div className="project-detail-image">
                            <Image
                                src={getImageUrl(project.thumbnail, '/images/placeholder-project.jpg')}
                                alt={project.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 80vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            <div className="project-overlay">
                                {project.status && (
                                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Info Grid */}
                    <div className="project-info-grid">
                        {/* Main Content */}
                        <div className="project-main-content">
                            {/* Key Features */}
                            {project.keyFeatures && project.keyFeatures.length > 0 && (
                                <div className="detail-section">
                                    <h2 className="detail-section-title">Key Features</h2>
                                    <ul className="feature-list">
                                        {project.keyFeatures.map((feature: string, idx: number) => (
                                            <li key={`feature-${idx}`} className="feature-item">
                                                <FaCheck className="feature-icon" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {hasTechStack && (
                                <div className="detail-section">
                                    <h2 className="detail-section-title">Technology Stack</h2>
                                    <div className="tech-stack-grid">
                                        {/* Handle both object format and array format */}
                                        {typeof project.techStack === 'object' && !Array.isArray(project.techStack) ? (
                                            // Object format: { frontend: [...], backend: [...] }
                                            Object.entries(project.techStack as Record<string, string[]>).map(([category, techs]) => (
                                                Array.isArray(techs) && techs.length > 0 && (
                                                    <div key={category} className="tech-stack-category">
                                                        <h4 className="tech-category-label">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                                        <div className="tech-pills">
                                                            {techs.map((tech: string, idx: number) => {
                                                                const Icon = getTechIcon(tech);
                                                                return (
                                                                    <span key={`${category}-${idx}`} className="tech-pill">
                                                                        {Icon && <Icon className="tech-pill-icon" />}
                                                                        {tech}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            ))
                                        ) : Array.isArray(project.techStack) ? (
                                            // Array format: ["React", "Node.js", ...]
                                            <div className="tech-pills">
                                                {project.techStack.map((tech: string, idx: number) => {
                                                    const Icon = getTechIcon(tech);
                                                    return (
                                                        <span key={`tech-${idx}`} className="tech-pill">
                                                            {Icon && <Icon className="tech-pill-icon" />}
                                                            {tech}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {/* Services Provided */}
                            {project.servicesProvided && project.servicesProvided.length > 0 && (
                                <div className="detail-section">
                                    <h2 className="detail-section-title">Services Provided</h2>
                                    <div className="services-tags">
                                        {project.servicesProvided.map((service: string, idx: number) => (
                                            <span key={`service-${idx}`} className="service-tag">{service}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="project-sidebar">
                            {/* Project Details Card */}
                            <div className="sidebar-card">
                                <h3 className="sidebar-title">Project Details</h3>

                                {project.category && (
                                    <div className="sidebar-item">
                                        <span className="sidebar-icon">📁</span>
                                        <div>
                                            <span className="sidebar-label">Category</span>
                                            <span className="sidebar-value">{project.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                        </div>
                                    </div>
                                )}

                                {project.industry && (
                                    <div className="sidebar-item">
                                        <FaIndustry className="sidebar-icon" />
                                        <div>
                                            <span className="sidebar-label">Industry</span>
                                            <span className="sidebar-value">{project.industry}</span>
                                        </div>
                                    </div>
                                )}

                                {clientName !== 'N/A' && (
                                    <div className="sidebar-item">
                                        <span className="sidebar-icon">🏢</span>
                                        <div>
                                            <span className="sidebar-label">Client</span>
                                            <span className="sidebar-value">{clientName}</span>
                                        </div>
                                    </div>
                                )}

                                {clientLocation && (
                                    <div className="sidebar-item">
                                        <FaMapMarkerAlt className="sidebar-icon" />
                                        <div>
                                            <span className="sidebar-label">Location</span>
                                            <span className="sidebar-value">{clientLocation}</span>
                                        </div>
                                    </div>
                                )}

                                {project.timeline && (
                                    <div className="sidebar-item">
                                        <FaClock className="sidebar-icon" />
                                        <div>
                                            <span className="sidebar-label">Timeline</span>
                                            <span className="sidebar-value">{project.timeline}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Metrics Card */}
                            {hasMetrics && (
                                <div className="sidebar-card metrics-card">
                                    <h3 className="sidebar-title">
                                        <FaChartLine className="title-icon" /> Key Metrics
                                    </h3>
                                    <div className="metrics-grid">
                                        {Object.entries(project.metrics as Record<string, string>).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="metric-item">
                                                    <span className="metric-value">{value}</span>
                                                    <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {(liveLink || githubLink || caseStudyLink) && (
                                <div className="sidebar-actions">
                                    {liveLink && (
                                        <Button href={liveLink} variant="primary" target="_blank">
                                            <FaExternalLinkAlt /> View Live Site
                                        </Button>
                                    )}
                                    {githubLink && (
                                        <Button href={githubLink} variant="outline" target="_blank">
                                            <FaGithub /> View Code
                                        </Button>
                                    )}
                                    {caseStudyLink && (
                                        <Button href={caseStudyLink} variant="outline" target="_blank">
                                            <FaFileAlt /> Case Study
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Projects */}
                    {relatedProjects.length > 0 && (
                        <div className="related-projects">
                            <h2 className="section-title">Related Projects</h2>
                            <div className="related-grid">
                                {relatedProjects.map((relatedProject) => (
                                    <Link
                                        key={relatedProject.id || relatedProject.slug}
                                        href={`/portfolio/${relatedProject.slug}`}
                                        className="related-card"
                                    >
                                        <div className="related-image">
                                            <Image
                                                src={getImageUrl(relatedProject.thumbnail, '/images/placeholder-project.jpg')}
                                                alt={relatedProject.title}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="related-content">
                                            <span className="related-category">{relatedProject.category}</span>
                                            <h3 className="related-title">{relatedProject.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="cta-wrapper">
                        <div className="cta-box">
                            <h3>Have a Similar Project in Mind?</h3>
                            <p>Let&apos;s discuss how we can help bring your vision to life with cutting-edge technology solutions.</p>
                            <Button href="/contact" variant="primary">Start Your Project</Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
