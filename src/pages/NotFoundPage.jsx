import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/common';

const NotFoundPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary flex items-center justify-center relative overflow-hidden">
      <SEO title="404 — Archive Entry Not Found" description="The page you're looking for doesn't exist." noIndex />

      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-30" />

      <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Reference number */}
          <div className="font-mono text-meta text-ink-faint uppercase tracking-widest mb-6">
            Error 404 — Archive Entry Not Found
          </div>

          {/* Large 404 */}
          <h1 className="font-editorial text-[8rem] sm:text-[10rem] leading-none text-ink-primary/10 mb-4 select-none">
            404
          </h1>

          {/* Message */}
          <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary mb-3">
            Entry not found
          </h2>
          <p className="text-body-sm text-ink-muted mb-8 max-w-sm mx-auto leading-relaxed">
            This document doesn't exist in the archive.
            It may have been removed, or the reference number is incorrect.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2 px-5 py-2.5 text-body-sm text-ink-primary border border-notebook-border hover:border-blueprint/20 transition-all duration-300"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Return to Archive</span>
            </Link>

            <Link
              to="/blog"
              className="flex items-center gap-2 px-5 py-2.5 text-body-sm text-ink-muted hover:text-ink-primary transition-all duration-300"
            >
              <span>Browse Logbook</span>
            </Link>
          </div>

          {/* Back link */}
          <button
            onClick={() => window.history.back()}
            className="mt-6 font-mono text-meta text-ink-faint hover:text-ink-muted transition-colors duration-300"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
