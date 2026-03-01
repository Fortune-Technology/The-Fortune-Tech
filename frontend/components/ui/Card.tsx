import { ReactNode } from 'react';
import { getIcon } from '../../lib/icons';

interface CardProps {
    title: string;
    description: string;
    icon?: string;
    children?: ReactNode;
    className?: string;
}

export default function Card({ title, description, icon, children, className = '' }: CardProps) {
    // Dynamic Icon Rendering using shared utility
    const IconComponent = icon ? getIcon(icon) : null;

    return (
        <div className={`card ${className}`}>
            {IconComponent && (
                <div className="card-icon">
                    <IconComponent />
                </div>
            )}
            <h3 className="card-title">{title}</h3>
            <p className="card-text">{description}</p>
            {children}
        </div>
    );
}
