'use client';

import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { getIcon } from '../../lib/icons';
import { getImageUrl } from '../../lib/utils';
import { FaCheck, FaStar, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { useGetServicesQuery } from '../../lib/store/api/servicesApi';

export default function ServicesPage() {
  const { data: servicesResponse, isLoading, isError } = useGetServicesQuery({ pageSize: 100 });
  const services = servicesResponse?.data || [];


  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Our Services"
          subtitle="Comprehensive technology solutions designed to accelerate your business growth and digital transformation."
        />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <FaSpinner className="spinner" />
              <p>Loading services...</p>
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
          title="Our Services"
          subtitle="Comprehensive technology solutions designed to accelerate your business growth and digital transformation."
        />
        <section className="section">
          <div className="container">
            <div className="error-state">
              <p>Failed to load services. Please try again later.</p>
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
        title="Our Services"
        subtitle="Comprehensive technology solutions designed to accelerate your business growth and digital transformation."
      />

      <section className="section">
        <div className="container">
          <div className="services-list">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon || '');
              const serviceKey = service.id || service._id || service.slug || `service-${index}`;
              return (
                <div
                  key={serviceKey}
                  className={`service-row ${index % 2 !== 0 ? 'reverse' : ''}`}
                  id={service.id || service._id}
                >
                  <div className="service-content">
                    {/* Featured Badge */}
                    {service.featured && (
                      <div className="service-featured-tag">
                        <FaStar /> Popular Choice
                      </div>
                    )}

                    <div className="service-header-row">
                      <div className="service-icon-wrapper">
                        {service.icon?.startsWith('/') ? (
                          <Image
                            src={getImageUrl(service.icon)}
                            alt={service.title}
                            width={48}
                            height={48}
                            className="service-icon-img"
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          Icon && <Icon />
                        )}
                      </div>
                      <h2 className="service-title-lg">{service.title}</h2>
                    </div>

                    {/* Tagline */}
                    {service.tagline && (
                      <span className="service-tagline-pill">{service.tagline}</span>
                    )}
                    <p className="service-description-lg">{service.description}</p>

                    <div className="service-details">
                      <div className="detail-col">
                        <h4 className="detail-title">Key Features</h4>
                        <ul className="detail-list">
                          {(service.features || []).slice(0, 4).map((feature, idx) => (
                            <li key={`feature-${idx}`}><FaCheck className="check-icon" /> {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="detail-col">
                        <h4 className="detail-title">Benefits</h4>
                        <ul className="detail-list">
                          {(service.benefits || []).slice(0, 4).map((benefit, idx) => (
                            <li key={`benefit-${idx}`}><FaStar className="star-icon" /> {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tech Stack Preview */}
                    {service.techStack && service.techStack.length > 0 && (
                      <div className="service-tech-preview">
                        <span className="tech-label">Technologies:</span>
                        {service.techStack.slice(0, 5).map((tech, idx) => (
                          <span key={`tech-${idx}`} className="tech-pill-sm">{tech}</span>
                        ))}
                        {service.techStack.length > 5 && (
                          <span className="tech-pill-sm more">+{service.techStack.length - 5}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="service-actions">
                      <Link href={`/services/${service.slug || service._id}`} className="btn btn-primary">
                        View Full Details <FaArrowRight />
                      </Link>

                    </div>
                  </div>
                  <div className="service-image-wrapper">
                    <Image
                      src={getImageUrl(service.thumbnail || service.image, '/images/placeholder-service.jpg')}
                      alt={service.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cta-wrapper">
            <div className="cta-box">
              <h3>Need a Custom Solution?</h3>
              <p>Contact our experts to discuss your specific requirements and get a tailored proposal.</p>
              <Button href="/contact" variant="primary">Get a Free Quote</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}