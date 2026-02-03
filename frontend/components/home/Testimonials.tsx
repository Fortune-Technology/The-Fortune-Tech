'use client';

import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '../ui/SectionTitle';
import { useGetFeaturedTestimonialsQuery } from '../../lib/store/api/testimonialsApi';
import { getImageUrl } from '../../lib/utils';
import { FaQuoteLeft, FaStar, FaLinkedin, FaExternalLinkAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function Testimonials() {
  // Fetch testimonials from API
  const { data: testimonialsResponse, isLoading, isError } = useGetFeaturedTestimonialsQuery();
  const testimonials = testimonialsResponse?.data || [];

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={`star ${i < rating ? 'filled' : 'empty'}`} />
    ));
  };

  // Get image URL - prioritize thumbnail, then avatar, then fallback
  const getTestimonialImage = (testimonial: { thumbnail?: string; avatar?: string; name: string }) => {
    if (testimonial.thumbnail) {
      return getImageUrl(testimonial.thumbnail, '/images/placeholder-avatar.jpg');
    }
    if (testimonial.avatar) {
      return getImageUrl(testimonial.avatar, '/images/placeholder-avatar.jpg');
    }
    return '/images/placeholder-avatar.jpg';
  };

  if (isLoading) {
    return (
      <section className="section testimonials-section">
        <div className="container">
          <SectionTitle
            title="What Our Clients Say"
            subtitle="Testimonials"
          />
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Loading testimonials...</p>
          </div>
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
        </div>
      </section>
    );
  }

  if (isError || testimonials.length === 0) {
    // Optionally return null or a fallback message if no testimonials
    return null;
  }

  return (
    <section className="section testimonials-section">
      <div className="container">
        <SectionTitle
          title="What Our Clients Say"
          subtitle="Testimonials"
        />

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id || testimonial._id}
              className={`testimonial-card-new ${testimonial.featured ? 'featured' : ''}`}
            >
              {/* Header */}
              <div className="testimonial-header">
                <div className="quote-icon-wrapper">
                  <FaQuoteLeft />
                </div>
                {testimonial.verified && (
                  <div className="verified-badge">
                    <FaCheckCircle /> Verified
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="testimonial-rating">
                {renderStars(testimonial.rating || 5)}
              </div>

              {/* Content */}
              <p className="testimonial-text">&ldquo;{testimonial.content}&rdquo;</p>

              {/* Metrics */}
              {testimonial.metrics && Object.keys(testimonial.metrics).length > 0 && (
                <div className="testimonial-metrics">
                  {Object.entries(testimonial.metrics).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="metric-badge">
                      <span className="metric-val">{value}</span>
                      <span className="metric-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service Tag */}
              {testimonial.serviceProvided && (
                <div className="testimonial-service">
                  <span className="service-label">{testimonial.serviceProvided}</span>
                </div>
              )}

              {/* Author */}
              <div className="testimonial-author-new">
                <div className="author-avatar-new">
                  <Image
                    src={getTestimonialImage(testimonial)}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="author-details">
                  <h4 className="author-name-new">{testimonial.name}</h4>
                  {testimonial.role && <span className="author-title">{testimonial.role}</span>}
                  {testimonial.company && <span className="author-company">{testimonial.company}</span>}
                </div>
                <div className="author-links">
                  {testimonial.linkedin && (
                    <Link href={testimonial.linkedin} target="_blank" className="author-link" aria-label="LinkedIn">
                      <FaLinkedin />
                    </Link>
                  )}
                  {testimonial.website && (
                    <Link href={testimonial.website} target="_blank" className="author-link" aria-label="Website">
                      <FaExternalLinkAlt />
                    </Link>
                  )}
                </div>
              </div>

              {/* Industry Badge */}
              {testimonial.industry && (
                <div className="testimonial-footer">
                  <span className="industry-badge">{testimonial.industry}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
