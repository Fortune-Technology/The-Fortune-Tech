'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, inView } from 'motion';

interface ScrollAnimateProps {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
    delay?: number;
    duration?: number;
    threshold?: number;
}

export default function ScrollAnimate({
    children,
    className = '',
    animation = 'fade-up',
    delay = 0,
    duration = 0.6,
    threshold = 0.2,
}: ScrollAnimateProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        // Define animation variants
        type AnimationValue = {
            opacity: number;
            x?: number;
            y?: number;
            scale?: number;
        };

        type AnimationConfig = {
            initial: AnimationValue;
            animate: AnimationValue;
        };

        const animations: Record<string, AnimationConfig> = {
            'fade-up': {
                initial: { opacity: 0, y: 40 },
                animate: { opacity: 1, y: 0 },
            },
            'fade-down': {
                initial: { opacity: 0, y: -40 },
                animate: { opacity: 1, y: 0 },
            },
            'fade-left': {
                initial: { opacity: 0, x: -40 },
                animate: { opacity: 1, x: 0 },
            },
            'fade-right': {
                initial: { opacity: 0, x: 40 },
                animate: { opacity: 1, x: 0 },
            },
            'scale': {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
            },
            'fade': {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
            },
        };

        const selectedAnimation = animations[animation];

        // Set initial state
        const initial = selectedAnimation.initial;
        const transforms: string[] = [];

        if (initial.x !== undefined) transforms.push(`translateX(${initial.x}px)`);
        if (initial.y !== undefined) transforms.push(`translateY(${initial.y}px)`);
        if (initial.scale !== undefined) transforms.push(`scale(${initial.scale})`);

        Object.assign(element.style, {
            opacity: String(initial.opacity),
            transform: transforms.join(' '),
        });

        // Observe element visibility
        const unobserve = inView(
            element,
            () => {
                // Trigger animation when element is in view
                setTimeout(() => {
                    animate(
                        element,
                        selectedAnimation.animate as any,
                        {
                            duration,
                        }
                    );
                }, delay * 1000);

                // Optionally unobserve after animation
                return () => { };
            },
            { amount: threshold }
        );

        return () => {
            unobserve();
        };
    }, [animation, delay, duration, threshold]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
