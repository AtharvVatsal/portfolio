import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getAnnotation } from '../../data/annotations';
import MarginNote from '../common/MarginNote';

const QuoteSection = ({ isVisible }) => {
  const { currentTheme } = useTheme();
  const quoteAnnotation = getAnnotation('quote', 0);

  return (
    <section className="py-section sm:py-section-lg relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative py-12 sm:py-16 transition-all duration-[900ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Left border — notebook margin */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, transparent, ${currentTheme.accent}40, transparent)` }}
          />

          <blockquote className="pl-6 sm:pl-8">
            <p className="font-editorial text-[1.5rem] sm:text-[2rem] text-ink-primary leading-snug italic">
              Merging{' '}
              <span className="not-italic" style={{ color: currentTheme.accent }}>logic</span>
              {' '}with{' '}
              <span className="not-italic text-amber">light</span>
              {' '}—{' '}
              <span className="text-ink-secondary">
                engineering solutions and capturing stories.
              </span>
            </p>

              <footer className="mt-6 sm:mt-8 flex items-center gap-3">
              <div className="w-8 h-px bg-ink-faint/50" />
              <cite className="not-italic font-mono text-meta text-ink-faint uppercase tracking-[0.15em]">
                Atharv Vatsal
              </cite>
            </footer>
          </blockquote>

          {/* Annotation */}
          {quoteAnnotation && (
            <div className="mt-6">
              <MarginNote text={quoteAnnotation.text} side={quoteAnnotation.side} variant="amber" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
