'use client';

import { useState } from 'react';
import SectionTitle from '../ui/SectionTitle';

import { useGetTechnologiesQuery } from '../../lib/store/api/technologiesApi';
import { getIcon } from '../../lib/icons';
import { FaCode, FaServer, FaDatabase, FaCloud, FaArrowRight, FaStar, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

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

export default function TechStack() {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { data: technologiesResponse, isLoading } = useGetTechnologiesQuery();
  const technologies = technologiesResponse?.data || [];

  // Sort categories to match Technologies page
  const categoryOrder = [
    'UI/UX Design',
    'Frontend',
    'Backend',
    'Database',
    'CMS',
    'Mobile App Development',
    'Cloud & DevOps',
  ];

  const sortedTechnologies = [...technologies].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category);
    const indexB = categoryOrder.indexOf(b.category);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.category.localeCompare(b.category);
  });

  return (
    <section className="section tech-section">
      <div className="container">
        <SectionTitle
          title="Technologies We Use"
          subtitle="Our Tech Stack"
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        ) : (
          <>
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
            </div>

            {/* Category Description */}
            <div className="tech-category-desc">
              <p>{sortedTechnologies[activeTab]?.description}</p>
            </div>

            {/* Active Tab Content */}
            <div className="tech-content">
              {sortedTechnologies.map((category, index) => {
                if (activeTab !== index) return null;
                const colors = categoryColors[category.category];

                return (
                  <div key={index} className="tech-content-inner">
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

                            {/* Icon - Centered by CSS */}
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

                            {/* Use Cases - Visible on Hover or Always? 
                               Technologies page logic: always visible if mapped? No, mapped but CSS handles display?
                               CSS for Use Cases in components.css:
                               .use-cases-list { width: 100%; margin-top: 0.5rem; }
                               .use-case-item { ... }
                               TechnologiesPage renders them.
                            */}
                            {item.useCases && item.useCases.length > 0 && (
                              <div className="use-cases-list">
                                <div className="use-cases-title">Use Cases</div>
                                {item.useCases.slice(0, 2).map((useCase, i) => ( // limit to 2 for home page to save space?
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

            {/* View All Link */}
            <div className="home-tech-footer">
              <Link href="/technologies" className="btn btn-outline home-tech-link">
                View All Technologies <FaArrowRight />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
