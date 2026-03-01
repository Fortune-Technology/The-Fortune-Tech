/**
 * Custom React hooks for reusable logic
 * These hooks encapsulate common patterns used across multiple components
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Animated counter hook with easing
 * Only starts counting when startCounting is true (for scroll-triggered animations)
 * @param end - Target number to count to
 * @param duration - Animation duration in ms (default: 2000)
 * @param startCounting - Whether to start the animation
 */
export function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startCounting) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, startCounting]);

    return count;
}

/**
 * Intersection observer hook for triggering animations when element enters viewport
 * @param threshold - Visibility threshold (0-1)
 * @param triggerOnce - If true, disconnects observer after first intersection
 */
export function useIntersectionObserver(threshold: number = 0.2, triggerOnce: boolean = true) {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, triggerOnce]);

    return { ref, isVisible };
}

/**
 * Debounced callback hook
 * Useful for search inputs or other user inputs that shouldn't trigger on every keystroke
 * @param callback - Function to debounce
 * @param delay - Delay in ms
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
}

/**
 * Scroll state hook for scroll-based UI changes (e.g., shrinking navbar)
 * @param threshold - Scroll position threshold in pixels
 */
export function useScrolled(threshold: number = 20) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
}
