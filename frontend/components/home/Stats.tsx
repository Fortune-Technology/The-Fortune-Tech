'use client';

import { memo } from 'react';
import { FaRocket, FaUsers, FaAward, FaCode, FaGlobe } from 'react-icons/fa';
import websiteConfig from '../../data/website-config.json';
import { useCountUp, useIntersectionObserver } from '../../lib/hooks';

// Transform stats from config to array format - extracted outside component for efficiency
const statsArray = (() => {
    const { stats } = websiteConfig;
    return [
        {
            key: 'projectsDelivered',
            icon: FaRocket,
            value: stats.projectsDelivered.value,
            suffix: stats.projectsDelivered.suffix,
            label: stats.projectsDelivered.label,
            description: 'Successfully completed',
        },
        {
            key: 'happyClients',
            icon: FaUsers,
            value: stats.happyClients.value,
            suffix: stats.happyClients.suffix,
            label: stats.happyClients.label,
            description: 'Worldwide partnerships',
        },
        {
            key: 'yearsExperience',
            icon: FaAward,
            value: stats.yearsExperience.value,
            suffix: stats.yearsExperience.suffix,
            label: stats.yearsExperience.label,
            description: 'Industry expertise',
        },
        {
            key: 'teamMembers',
            icon: FaCode,
            value: stats.teamMembers.value,
            suffix: stats.teamMembers.suffix,
            label: stats.teamMembers.label,
            description: 'Talented professionals',
        },
    ];
})();

type StatItem = (typeof statsArray)[0];

interface StatCardProps {
    stat: StatItem;
    index: number;
    isVisible: boolean;
}

/**
 * StatCard - Memoized for performance during counting animation
 * React.memo prevents unnecessary re-renders of individual cards
 */
const StatCard = memo(function StatCard({ stat, index, isVisible }: StatCardProps) {
    const count = useCountUp(stat.value, 2000, isVisible);
    const Icon = stat.icon;

    return (
        <div
            className="stats-card"
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            <div className="stats-card-icon">
                <Icon />
            </div>
            <div className="stats-card-content">
                <div className="stats-card-value">
                    {count}{stat.suffix}
                </div>
                <div className="stats-card-label">{stat.label}</div>
                <div className="stats-card-description">{stat.description}</div>
            </div>
            <div className="stats-card-glow" />
        </div>
    );
});

export default function Stats() {
    const { ref, isVisible } = useIntersectionObserver(0.2, true);

    return (
        <section ref={ref as React.RefObject<HTMLElement>} className="stats-section section ">
            <div className="stats-bg-decoration">
                <div className="stats-bg-circle stats-bg-circle-1" />
                <div className="stats-bg-circle stats-bg-circle-2" />
            </div>

            <div className="container">
                <div className="stats-header">
                    <span className="stats-badge">Our Impact</span>
                    <h2 className="stats-title">
                        Numbers That <span className="gradient-text">Speak</span>
                    </h2>
                    <p className="stats-subtitle">
                        Years of dedication, innovation, and client success stories
                    </p>
                </div>

                <div className={`stats-grid ${isVisible ? 'visible' : ''}`}>
                    {statsArray.map((stat, index) => (
                        <StatCard key={stat.key} stat={stat} index={index} isVisible={isVisible} />
                    ))}
                </div>

                <div className="stats-footer">
                    <div className="stats-testimonial">
                        <FaGlobe className="stats-testimonial-icon" />
                        <p>Trusted by businesses across <strong>15+ countries</strong> worldwide</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

