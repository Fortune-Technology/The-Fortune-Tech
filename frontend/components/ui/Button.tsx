import Link from 'next/link';
import { ReactNode, CSSProperties } from 'react';

interface ButtonProps {
    children: ReactNode;
    href?: string;
    variant?: 'primary' | 'outline';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    style?: CSSProperties;
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export default function Button({
    children,
    href,
    variant = 'primary',
    onClick,
    className = '',
    type = 'button',
    style,
    target
}: ButtonProps) {
    const baseClass = `btn btn-${variant} ${className}`;

    if (href) {
        return (
            <Link
                href={href}
                className={baseClass}
                style={style}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            >
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={baseClass} onClick={onClick} style={style}>
            {children}
        </button>
    );
}
