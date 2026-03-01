interface SectionTitleProps {
    title: string;
    subtitle?: string;
    align?: 'center' | 'left';
}

export default function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
    return (
        <div className={`section-header ${align === 'left' ? 'text-left' : ''}`} style={align === 'left' ? { textAlign: 'left' } : {}}>
            {subtitle && <span className="section-subtitle">{subtitle}</span>}
            <h2 className="section-title">{title}</h2>
        </div>
    );
}
