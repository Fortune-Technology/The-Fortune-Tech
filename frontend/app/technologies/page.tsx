'use client';

import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { getIcon } from '../../lib/icons';
import { FaCode, FaServer, FaDatabase, FaCloud, FaStar, FaCheckCircle, FaSpinner, FaBookOpen } from 'react-icons/fa';
import { useGetTechnologiesQuery } from '../../lib/store/api/technologiesApi';
import Stats from '../../components/home/Stats';

// Category icons mapping
const categoryIcons: { [key: string]: React.ComponentType } = {
  'Frontend': FaCode,
  'Backend': FaServer,
  'Database': FaDatabase,
  'Cloud & DevOps': FaCloud,
  'Mobile App Development': FaCheckCircle,
  'CMS': FaCode,
  'UI/UX Design': FaStar,
};

// Category colors
const categoryColors: { [key: string]: { primary: string; glow: string } } = {
  'Frontend': { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.2)' },
  'Backend': { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.2)' },
  'Database': { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.2)' },
  'Cloud & DevOps': { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
  'Mobile App Development': { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.2)' },
  'CMS': { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.2)' },
  'UI/UX Design': { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.2)' },
};

// Expertise level colors
const expertiseColors: { [key: string]: string } = {
  'Expert': '#22c55e',
  'Advanced': '#8b5cf6',
  'Intermediate': '#06b6d4',
  'Beginner': '#f59e0b',
};

export default function TechnologiesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { data: technologiesResponse, isLoading, isError } = useGetTechnologiesQuery();
  const technologies = technologiesResponse?.data || [];

  // Calculate stats
  const totalTech = technologies.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);

  // Sort categories
  const categoryOrder = [
    'UI/UX Design',
    'Frontend',
    'Backend',
    'Database',
    'CMS',
    'Mobile App Development',
    'Cloud & DevOps',
  ];

  // Create a copy and sort categories
  const sortedTechnologies = [...technologies].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category);
    const indexB = categoryOrder.indexOf(b.category);
    // If both are found in the list, sort by index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only A is found, it comes first
    if (indexA !== -1) return -1;
    // If only B is found, it comes first
    if (indexB !== -1) return 1;
    // If neither is found, sort alphabetically
    return a.category.localeCompare(b.category);
  });


  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Our Tech Stack"
          subtitle="We leverage cutting-edge technologies to build powerful, scalable solutions"
        />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <FaSpinner className="spinner" />
              <p>Loading technologies...</p>
            </div>
          </div>
        </section>
        <style jsx>{`
                    .loading-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 50vh;
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

  if (isError || technologies.length === 0) {
    return (
      <>
        <PageHeader
          title="Our Tech Stack"
          subtitle="We leverage cutting-edge technologies to build powerful, scalable solutions"
        />
        <section className="section">
          <div className="container">
            <div className="error-state">
              <p>Unable to load technologies. Please try again later.</p>
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
        title="Our Tech Stack"
        subtitle="We leverage cutting-edge technologies to build powerful, scalable solutions"
      />

      <section className="section">
        <div className="container">
          {/* Interactive Tabs */}
          <div className="tech-tabs-container">
            <div className="tech-tabs">
              {sortedTechnologies.map((category, index) => {
                const CategoryIcon = categoryIcons[category.category] || FaCode;
                const isActive = activeTab === index;
                const colors = categoryColors[category.category];

                return (
                  <button
                    key={index}
                    className={`tech-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                    style={{
                      '--tab-color': colors?.primary || '#8b5cf6',
                      '--tab-glow': colors?.glow || 'rgba(139, 92, 246, 0.2)',
                    } as React.CSSProperties}
                  >
                    <span className="tech-tab-icon">
                      <CategoryIcon />
                    </span>
                    <span className="tech-tab-label">{category.category}</span>
                    <span className="tech-tab-count">{category.items?.length || 0}</span>
                    {isActive && <span className="tech-tab-indicator" />}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="tech-content">
              {sortedTechnologies.map((category, index) => {
                if (activeTab !== index) return null;
                const colors = categoryColors[category.category];

                return (
                  <div key={index} className="tech-content-inner">
                    {/* Category Description */}
                    <div className="tech-category-header">
                      <p className="tech-category-description">
                        {category.description}
                      </p>
                    </div>

                    {/* Technology Cards */}
                    <div className="tech-cards-grid-responsive">
                      {(category.items || []).map((item, idx) => {
                        const Icon = getIcon(item.icon || '');
                        const isHovered = hoveredCard === idx;

                        return (
                          <div
                            key={idx}
                            className={`tech-card-detailed ${isHovered ? 'hovered' : ''} ${item.featured ? 'featured' : ''}`}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                              '--card-color': colors?.primary || '#8b5cf6',
                              '--card-glow': colors?.glow || 'rgba(139, 92, 246, 0.2)',
                              animationDelay: `${idx * 0.1}s`,
                            } as React.CSSProperties}
                          >
                            {/* Featured Badge */}
                            {item.featured && (
                              <div className="tech-featured-badge">
                                <FaStar /> Featured
                              </div>
                            )}

                            {/* Icon */}
                            <div className="tech-card-icon-wrapper-new">
                              <div className="tech-card-icon-bg-new" />
                              <div className="tech-card-icon-main">
                                {item.icon?.startsWith('/') || item.icon?.startsWith('http') ? (
                                  <img
                                    src={item.icon.startsWith('http') ? item.icon : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${item.icon}` : item.icon)}
                                    alt={item.name}
                                    className="w-12 h-12 object-contain filter drop-shadow-lg p-2 bg-white/5 rounded-lg"
                                  />
                                ) : (
                                  Icon ? <Icon /> : <span>?</span>
                                )}
                              </div>
                            </div>

                            {/* Name */}
                            <h4 className="tech-card-name-detailed">{item.name}</h4>



                            {/* Use Cases */}
                            {item.useCases && item.useCases.length > 0 && (
                              <div className="use-cases-list">
                                <h5 className="use-cases-title">Use Cases</h5>
                                {item.useCases.map((useCase, i) => (
                                  <div key={i} className="use-case-item">
                                    <FaCheckCircle className="use-case-icon" />
                                    <span>{useCase}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="tech-card-shine" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="tech-stats-section-new">
            <div className="tech-stat-card-new">
              <div className="tech-stat-icon">
                <FaCode />
              </div>
              <div className="tech-stat-number-new">{totalTech}+</div>
              <div className="tech-stat-label-new">Technologies Mastered</div>
            </div>
            <div className="tech-stat-card-new">
              <div className="tech-stat-icon">
                <FaStar />
              </div>
              <div className="tech-stat-number-new">100%</div>
              <div className="tech-stat-label-new">Project Success</div>
            </div>

            <div className="tech-stat-card-new">
              <div className="tech-stat-icon">
                <FaCheckCircle />
              </div>
              <div className="tech-stat-number-new">100%</div>
              <div className="tech-stat-label-new">Modern Stack</div>
            </div>

            <div className="tech-stat-card-new">
              <div className="tech-stat-icon">
                <FaBookOpen />
              </div>
              <div className="tech-stat-number-new">50+</div>
              <div className="tech-stat-label-new">Recent Case Studies or Blogs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reusing Home Stats Section */}
      <Stats />
    </>
  );
}
