'use client';

import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { getIcon } from '../../lib/icons';
import { FaCode, FaServer, FaDatabase, FaCloud, FaStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useGetTechnologiesQuery } from '../../lib/store/api/technologiesApi';

// Category icons mapping
const categoryIcons: { [key: string]: React.ComponentType } = {
  'Frontend': FaCode,
  'Backend': FaServer,
  'Database': FaDatabase,
  'Cloud & Tools': FaCloud,
};

// Category colors
const categoryColors: { [key: string]: { primary: string; glow: string } } = {
  'Frontend': { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.2)' },
  'Backend': { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.2)' },
  'Database': { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.2)' },
  'Cloud & Tools': { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
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
  const expertCount = technologies.reduce((acc, cat) =>
    acc + (cat.items || []).filter(item => item.expertiseLevel === 'Expert' || item.expertiseLevel === 'Advanced').length, 0
  );

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
              {technologies.map((category, index) => {
                const CategoryIcon = categoryIcons[category.name] || FaCode;
                const isActive = activeTab === index;
                const colors = categoryColors[category.name];

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
                    <span className="tech-tab-label">{category.name}</span>
                    <span className="tech-tab-count">{category.items?.length || 0}</span>
                    {isActive && <span className="tech-tab-indicator" />}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="tech-content">
              {technologies.map((category, index) => {
                if (activeTab !== index) return null;
                const colors = categoryColors[category.name];

                return (
                  <div key={index} className="tech-content-inner">
                    {/* Category Description */}
                    <div className="tech-category-header">
                      <p className="tech-category-description">
                        {category.description}
                      </p>
                    </div>

                    {/* Technology Cards */}
                    <div className="tech-cards-grid-new">
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
                                {Icon ? <Icon /> : <span>?</span>}
                              </div>
                            </div>

                            {/* Name */}
                            <h4 className="tech-card-name-detailed">{item.name}</h4>

                            {/* Expertise Level */}
                            <div
                              className="expertise-level-badge"
                              style={{
                                '--expertise-color': expertiseColors[item.expertiseLevel || 'Intermediate']
                              } as React.CSSProperties}
                            >
                              {item.expertiseLevel}
                            </div>

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
              <div className="tech-stat-number-new">{expertCount}</div>
              <div className="tech-stat-label-new">Advanced Expertise</div>
            </div>

            <div className="tech-stat-card-new">
              <div className="tech-stat-icon">
                <FaCheckCircle />
              </div>
              <div className="tech-stat-number-new">100%</div>
              <div className="tech-stat-label-new">Modern Stack</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
