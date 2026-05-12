'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
  /** If true, always animate immediately after mount (for above-fold elements) */
  immediate?: boolean;
  /** Delay before starting animation in ms */
  delay?: number;
}

export function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '+',
  prefix = '',
  className = '',
  decimals = 0,
  immediate = true,
  delay = 500,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  }, []);

  useEffect(() => {
    // Prevent double-start in React Strict Mode
    if (hasStarted.current) return;

    const startAnimation = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentCount = easedProgress * target;

        const displayCount = progress >= 0.995
          ? target // Snap to target when 99.5%+ complete
          : (decimals > 0 ? parseFloat(currentCount.toFixed(decimals)) : Math.floor(currentCount));

        setCount(displayCount);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    if (immediate) {
      // For above-fold elements: start after a delay to ensure mount
      timeoutRef.current = setTimeout(startAnimation, delay);
    } else {
      // For below-fold elements: use IntersectionObserver
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted.current) {
            startAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px' }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [target, duration, easeOutCubic, decimals, immediate, delay]);

  return (
    <span ref={ref} className={`counter-number ${className}`}>
      {prefix}{count}{suffix}
    </span>
  );
}
