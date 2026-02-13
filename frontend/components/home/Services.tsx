'use client';

import Link from 'next/link';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
// import serviceData from '../../data/services.json';
import { useGetFeaturedServicesQuery, Service } from '../../lib/store/api/servicesApi';
import { getIcon } from '../../lib/icons';
import { FaArrowRight, FaCheck, FaSpinner } from 'react-icons/fa';

// Pre-computed displayed services - sorted by featured and limited to 3
// Computed once at module load time for efficiency
// const displayedServices = (serviceData as unknown as Service[])
//     .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
//     .slice(0, 3);


export default function Services() {
    const { data: servicesResponse, isLoading, isError } = useGetFeaturedServicesQuery();
    const services = servicesResponse?.data || [];
    const displayedServices = services.slice(0, 3);


    return (
        <section className="section services-section">
            <div className="container">
                <SectionTitle
                    title="Our Expertise"
                    subtitle="What We Do"
                />

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-4xl text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="services-cards-grid">
                            {displayedServices.map((service) => {
                                const Icon = getIcon(service.icon || '');
                                return (
                                    <Link
                                        key={service.id}
                                        href={`/services#${service.id}`}
                                        className="service-card-link"
                                    >
                                        <div className={`service-card-new ${service.featured ? 'featured' : ''}`}>
                                            {/* Featured Badge */}
                                            {service.featured && (
                                                <div className="service-featured-badge">Popular</div>
                                            )}

                                            {/* Icon */}
                                            <div className="service-icon-new">
                                                {Icon && <Icon />}
                                            </div>

                                            {/* Title & Tagline */}
                                            <h3 className="service-title-new">{service.title}</h3>
                                            <p className="service-tagline">{service.tagline}</p>

                                            {/* Description */}
                                            <p className="service-desc">{service.description}</p>

                                            {/* Key Features (show first 3) */}
                                            <ul className="service-features-list">
                                                {(service.features || []).slice(0, 3).map((feature, idx) => (
                                                    <li key={idx}>
                                                        <FaCheck className="feature-check" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Tech Stack Preview */}
                                            {service.techStack && service.techStack.length > 0 && (
                                                <div className="service-tech-preview">
                                                    {service.techStack.slice(0, 3).map((tech, idx) => (
                                                        <span key={idx} className="tech-mini-tag">{tech}</span>
                                                    ))}
                                                    {service.techStack.length > 3 && (
                                                        <span className="tech-mini-tag more">+{service.techStack.length - 3}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Footer */}
                                            <div className="service-card-footer">
                                                <span className="service-pricing">{service.pricingHint}</span>
                                                <span className="service-cta-link">
                                                    {service.cta} <FaArrowRight />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex justify-center" style={{ marginTop: '3rem' }}>
                            <Button href="/services" variant="outline">
                                View All Services
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
