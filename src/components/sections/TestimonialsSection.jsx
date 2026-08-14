import React from 'react';
import { testimonials } from '../../data';

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-mono text-meta text-ink-faint uppercase tracking-widest">
              Section
            </span>
            <span className="font-mono text-meta text-amber">
              07
            </span>
          </div>
          <h2 className="font-editorial text-headline sm:text-display text-ink-primary">
            Signal Reports
          </h2>
          <p className="font-mono text-meta text-ink-muted mt-3">
            Feedback from collaborators and observers
          </p>
        </div>

        {/* Testimonials — minimal document cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="doc-card p-5 sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center border border-notebook-border bg-notebook-surface text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-ink-primary">{testimonial.name}</h4>
                  <p className="font-mono text-meta text-ink-faint">{testimonial.role}</p>
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-body-sm text-ink-muted italic leading-relaxed border-l border-notebook-border pl-3">
                {testimonial.content}
              </blockquote>

              {/* Rating — minimal dots */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blueprint/40" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
