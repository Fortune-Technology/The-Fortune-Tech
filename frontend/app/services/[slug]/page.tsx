'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import { getIcon } from '../../../lib/icons';
import { getImageUrl } from '../../../lib/utils';
import { useGetServiceByIdQuery, useGetServicesQuery } from '../../../lib/store/api/servicesApi';
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaStar,
    FaBoxOpen,
    FaCogs,
    FaUsers,
    FaRocket,
    FaLightbulb,
    FaShieldAlt,
    FaSpinner
} from 'react-icons/fa';

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    // Fetch service by slug
    const { data: serviceResponse, isLoading, isError } = useGetServiceByIdQuery(slug);
    const service = serviceResponse?.data;

    // Fetch all services for related services
    const { data: servicesResponse } = useGetServicesQuery();
    const allServices = servicesResponse?.data || [];

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title="Loading..."
                    subtitle="Please wait while we load the service details"
                />
                <section className="section">
                    <div className="container">
                        <div className="loading-state">
                            <FaSpinner className="spinner" />
                            <p>Loading service details...</p>
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

    if (isError || !service) {
        notFound();
    }

    const Icon = getIcon(service.icon || '');

    // Find related services (excluding current)
    const relatedServices = allServices
        .filter((s) => s.id !== service.id && s.slug !== service.slug)
        .slice(0, 3);

    return (
        <>
            <PageHeader
                title={service.title}
                subtitle={service.tagline || service.description}
            />

            <section className="section">
                <div className="container">
                    {/* Back Button */}
                    <Link href="/services" className="back-link">
                        <FaArrowLeft /> Back to Services
                    </Link>

                    {/* Service Hero */}
                    <div className="service-detail-hero">
                        <div className="service-detail-image">
                            <Image
                                src={getImageUrl(service.thumbnail || service.image, '/images/placeholder-service.jpg')}
                                alt={service.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 60vw"
                                className="img-cover"
                                priority
                            />
                            {service.featured && (
                                <div className="service-detail-badge">
                                    <FaStar /> Popular Choice
                                </div>
                            )}
                        </div>
                        <div className="service-detail-intro">
                            <div className="service-detail-icon">
                                {Icon && <Icon />}
                            </div>
                            <div className="service-detail-meta">
                                {service.idealFor && service.idealFor.length > 0 && (
                                    <div className="service-detail-ideal">
                                        <FaUsers className="ideal-icon" />
                                        <span>Ideal for: {service.idealFor.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                            <p className="service-detail-overview">
                                {service.overview || service.description}
                            </p>
                            <Button href="/contact" variant="primary">
                                {service.cta || 'Get Started'} <FaArrowRight />
                            </Button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="service-detail-grid">
                        {/* Features Section */}
                        {service.features && service.features.length > 0 && (
                            <div className="service-detail-section">
                                <div className="section-header-icon">
                                    <FaCheck />
                                </div>
                                <h2 className="section-heading">Key Features</h2>
                                <p className="section-description">What&apos;s included in our {service.title.toLowerCase()} service</p>
                                <ul className="feature-grid">
                                    {service.features.map((feature: string, idx: number) => (
                                        <li key={`feature-${idx}`} className="feature-card">
                                            <div className="feature-check">
                                                <FaCheck />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Deliverables Section */}
                        {service.deliverables && service.deliverables.length > 0 && (
                            <div className="service-detail-section">
                                <div className="section-header-icon deliverables">
                                    <FaBoxOpen />
                                </div>
                                <h2 className="section-heading">What You&apos;ll Get</h2>
                                <p className="section-description">Tangible deliverables from your project</p>
                                <ul className="deliverables-grid">
                                    {service.deliverables.map((item: string, idx: number) => (
                                        <li key={`deliverable-${idx}`} className="deliverable-card">
                                            <div className="deliverable-number">{idx + 1}</div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Benefits Section */}
                        {service.benefits && service.benefits.length > 0 && (
                            <div className="service-detail-section">
                                <div className="section-header-icon benefits">
                                    <FaRocket />
                                </div>
                                <h2 className="section-heading">Benefits</h2>
                                <p className="section-description">How this service helps your business grow</p>
                                <ul className="benefits-grid">
                                    {service.benefits.map((benefit: string, idx: number) => (
                                        <li key={`benefit-${idx}`} className="benefit-card">
                                            <FaStar className="benefit-icon" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Process Section */}
                        {service.process && service.process.length > 0 && (
                            <div className="service-detail-section full-width">
                                <div className="section-header-icon process">
                                    <FaCogs />
                                </div>
                                <h2 className="section-heading">Our Process</h2>
                                <p className="section-description">How we approach your {service.title.toLowerCase()} project</p>
                                <div className="process-timeline">
                                    {service.process?.map((step: string, idx: number) => (
                                        <div key={`process-${idx}`} className="process-timeline-item">
                                            <div className="process-timeline-number">{idx + 1}</div>
                                            <div className="process-timeline-content">
                                                <h4>{step}</h4>
                                            </div>
                                            {idx < (service.process?.length || 0) - 1 && (
                                                <div className="process-timeline-connector" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tech Stack Section */}
                        {service.techStack && service.techStack.length > 0 && (
                            <div className="service-detail-section full-width">
                                <div className="section-header-icon tech">
                                    <FaLightbulb />
                                </div>
                                <h2 className="section-heading">Technologies We Use</h2>
                                <p className="section-description">Industry-leading tools and frameworks for your project</p>
                                <div className="tech-stack-grid">
                                    {service.techStack.map((tech: string, idx: number) => (
                                        <div key={`tech-${idx}`} className="tech-stack-card">
                                            <FaShieldAlt className="tech-stack-icon" />
                                            <span>{tech}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Related Services */}
                    {relatedServices.length > 0 && (
                        <div className="related-services">
                            <h2 className="section-title">Explore Other Services</h2>
                            <div className="related-services-grid">
                                {relatedServices.map((relatedService) => {
                                    const RelatedIcon = getIcon(relatedService.icon || '');
                                    return (
                                        <Link
                                            key={relatedService.id || relatedService.slug}
                                            href={`/services/${relatedService.slug}`}
                                            className="related-service-card"
                                        >
                                            <div className="related-service-image">
                                                <Image
                                                    src={getImageUrl(relatedService.thumbnail || relatedService.image, '/images/placeholder-service.jpg')}
                                                    alt={relatedService.title}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="img-cover"
                                                />
                                            </div>
                                            <div className="related-service-content">
                                                <div className="related-service-icon">
                                                    {RelatedIcon && <RelatedIcon />}
                                                </div>
                                                <h3 className="related-service-title">{relatedService.title}</h3>
                                                <p className="related-service-tagline">{relatedService.tagline || relatedService.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="cta-wrapper">
                        <div className="cta-box">
                            <h3>Ready to Get Started with {service.title}?</h3>
                            <p>Contact us today to discuss your project requirements and get a personalized quote.</p>
                            <div className="cta-buttons">
                                <Button href="/contact" variant="primary">
                                    {service.cta || 'Get Started'} <FaArrowRight />
                                </Button>
                                <Button href="/services" variant="outline">
                                    Explore Other Services
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
