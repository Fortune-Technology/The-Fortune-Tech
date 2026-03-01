'use client';

import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/ui/PageHeader';
import { getImageUrl } from '../../lib/utils';
import { FaArrowRight, FaStar, FaSpinner } from 'react-icons/fa';
import { useGetPortfoliosQuery } from '../../lib/store/api/portfolioApi';

// Helper to get all tech from techStack object
const getAllTech = (techStack: Record<string, string[]> | undefined): string[] => {
  if (!techStack) return [];
  const allTech: string[] = [];
  Object.values(techStack).forEach((techs) => {
    if (Array.isArray(techs)) {
      allTech.push(...techs);
    }
  });
  return allTech.slice(0, 4); // Limit to 4 tags for display
};

// Status badge color
const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'status-completed';
    case 'live':
      return 'status-live';
    default:
      return 'status-default';
  }
};

export default function PortfolioPage() {
  const { data: portfolioResponse, isLoading, isError } = useGetPortfoliosQuery();
  const projects = portfolioResponse?.data || [];

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Our Portfolio"
          subtitle="Explore our latest projects and see how we've helped businesses transform their digital presence."
        />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <FaSpinner className="spinner" />
              <p>Loading portfolio...</p>
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
          title="Our Portfolio"
          subtitle="Explore our latest projects and see how we've helped businesses transform their digital presence."
        />
        <section className="section">
          <div className="container">
            <div className="error-state">
              <p>Failed to load portfolio. Please try again later.</p>
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
        title="Our Portfolio"
        subtitle="Explore our latest projects and see how we've helped businesses transform their digital presence."
      />

      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {projects.map((project) => (
              <Link
                key={project.id || project._id}
                href={`/portfolio/${project.slug || project.id}`}
                className="project-card-link"
              >
                <div className="project-card">
                  {project.featured && (
                    <div className="featured-badge">
                      <FaStar /> Featured
                    </div>
                  )}
                  <div className="project-image">
                    <Image
                      src={getImageUrl(project.thumbnail, '/images/placeholder-project.jpg')}
                      alt={project.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="img-cover"
                    />
                    <div className="project-image-overlay">
                      <span className="view-project">
                        View Project <FaArrowRight />
                      </span>
                    </div>
                  </div>
                  <div className="project-content">
                    <div className="project-meta">
                      <span className="project-category">{project.category}</span>
                      <span className={`project-status ${getStatusClass(project.status || '')}`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-footer">
                      <div className="project-tech">
                        {getAllTech(project.techStack as Record<string, string[]>).map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <span className="project-industry">{project.industry}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
