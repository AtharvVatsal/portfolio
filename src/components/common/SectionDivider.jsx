import React from 'react';

const SectionDivider = () => {
  return (
    <div className="relative h-16 sm:h-20 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-notebook-border to-transparent" />

        {/* Center diamond — reference mark */}
        <div className="absolute flex items-center justify-center">
          <div className="w-1 h-1 rotate-45 bg-blueprint/30" />
        </div>

        {/* Measurement ticks */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line
            x1="15%"
            y1="40%"
            x2="15%"
            y2="60%"
            stroke="#6366F1"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="50%"
            y1="30%"
            x2="50%"
            y2="70%"
            stroke="#6366F1"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="85%"
            y1="40%"
            x2="85%"
            y2="60%"
            stroke="#6366F1"
            strokeWidth="0.5"
            opacity="0.15"
          />
        </svg>
      </div>
    </div>
  );
};

export default SectionDivider;
