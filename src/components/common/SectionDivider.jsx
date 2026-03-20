import React from 'react';

const SectionDivider = ({ color = 'cyan', animated = true }) => {
  const colorClasses = {
    cyan: 'via-cyan-500/3',
    purple: 'via-purple-500/3',
    blue: 'via-blue-500/3',
    pink: 'via-pink-500/3'
  };

  return (
    <div className="relative h-20 sm:h-32 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${colorClasses[color]} to-transparent`}></div>
      {animated && (
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
        </svg>
      )}
    </div>
  );
};

export default SectionDivider;
