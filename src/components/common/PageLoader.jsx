import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RETRIEVAL_STEPS = [
  'Locating document',
  'Retrieving from archive',
  'Decoding contents',
  'Preparing view',
];

const PageLoader = () => {
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, RETRIEVAL_STEPS.length - 1));
    }, 200);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const docRef = {
    '/blog': 'AV-ARCH-BLOG',
    '/gallery': 'AV-ARCH-OBS',
    '/projects': 'AV-ARCH-CASE',
    '/resume': 'AV-ARCH-RESUME',
  }[location.pathname] || 'AV-ARCH-000';

  return (
    <div className="min-h-screen bg-notebook-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="font-mono text-meta text-ink-faint uppercase tracking-[0.15em]">
          <span className="text-blueprint/60">ARCHIVE</span>
          <span className="text-ink-faint/70 mx-2">/</span>
          <span>{docRef}</span>
        </div>
        <div className="w-48 h-px bg-notebook-border overflow-hidden">
          <div
            className="h-full bg-blueprint/60 transition-all duration-300 ease-out"
            style={{ width: `${((stepIndex + 1) / RETRIEVAL_STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 font-mono text-meta text-ink-faint">
          <span className="w-1.5 h-1.5 rounded-full bg-blueprint/40 animate-pulse" />
          {RETRIEVAL_STEPS[stepIndex]}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
