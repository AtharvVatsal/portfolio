import React from 'react';
import { stats } from '../../data';
import { getAnnotation } from '../../data/annotations';
import MarginNote from '../common/MarginNote';

const StatsSection = () => {
  const statsAnnotation = getAnnotation('stats', 0);

  return (
    <section className="py-10 sm:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-notebook-border">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-notebook-bg p-5 sm:p-6 group hover:bg-notebook-surface transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} className="text-ink-muted group-hover:text-blueprint transition-colors duration-300 flex-shrink-0" />
                  <div>
                    <div className="font-mono text-title sm:text-[1.5rem] text-ink-primary font-semibold">
                      {stat.value}
                    </div>
                    <div className="meta-label mt-1">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Annotation */}
        {statsAnnotation && (
          <div className="mt-4">
            <MarginNote text={statsAnnotation.text} side={statsAnnotation.side} variant="amber" />
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
