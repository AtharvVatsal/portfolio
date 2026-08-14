import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, sectionNum, subtitle, backLabel = '← Archive' }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-notebook-bg/80 border-b border-notebook-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-ink-muted hover:text-ink-primary transition-colors duration-300 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-mono text-meta uppercase tracking-wider">{backLabel}</span>
        </Link>

        <div className="flex items-center gap-2">
          {sectionNum && (
            <span className="font-mono text-meta text-blueprint">{sectionNum}</span>
          )}
          <span className="text-body-sm text-ink-primary font-medium">{title}</span>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
