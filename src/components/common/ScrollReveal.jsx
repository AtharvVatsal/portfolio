import React, { useRef, useEffect, useState } from 'react';

const variants = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    hidden: 'opacity-0 -translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 -translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
  'scale': {
    hidden: 'opacity-0 scale-90',
    visible: 'opacity-100 scale-100',
  },
  'blur': {
    hidden: 'opacity-0 blur-sm',
    visible: 'opacity-100 blur-0',
  },
};

const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  className = '',
  stagger = 0,       // if wrapping multiple children, stagger each by this ms
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold,
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, once]);

  const v = variants[variant] || variants['fade-up'];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? v.visible : v.hidden} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Wrapper that staggers multiple children
export const ScrollRevealGroup = ({
  children,
  variant = 'fade-up',
  stagger = 100,
  duration = 700,
  threshold = 0.1,
  className = '',
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { root: null, rootMargin: '0px 0px -40px 0px', threshold }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold]);

  const v = variants[variant] || variants['fade-up'];

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <div
          className={`transition-all ease-out ${isVisible ? v.visible : v.hidden}`}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${i * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollReveal;