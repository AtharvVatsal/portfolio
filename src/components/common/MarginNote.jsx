import React from 'react';

const MarginNote = ({
  text,
  side = 'right',
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'text-ink-muted',
    amber: 'text-amber',
    blue: 'text-blueprint',
    draft: 'text-ink-faint border-l border-notebook-border pl-2 italic',
  };

  return (
    <div
      className={`
        font-mono text-meta leading-relaxed tracking-wide
        ${variantStyles[variant] || variantStyles.default}
        ${side === 'left' ? 'md:text-right' : 'md:text-left'}
        text-left opacity-60
        my-3 md:my-0
        ${className}
      `}
    >
      <span className="text-ink-faint/60 mr-1.5 select-none">{'// '}</span>
      {text}
    </div>
  );
};

export const InlineNote = ({ text, variant = 'default' }) => {
  const variantStyles = {
    default: 'text-ink-muted',
    amber: 'text-amber',
    blue: 'text-blueprint',
    strike: 'text-ink-faint line-through opacity-50',
  };

  return (
    <span
      className={`
        font-mono text-meta tracking-wide
        ${variantStyles[variant] || variantStyles.default}
        opacity-60
      `}
    >
      {text}
    </span>
  );
};

export const RevisionNote = ({ text }) => (
  <div className="meta-label opacity-40 my-2">
    <span className="text-blueprint/50 mr-1.5">REV:</span>
    {text}
  </div>
);

export const FailedAttempt = ({ text }) => (
  <div className="font-mono text-meta text-ink-faint tracking-wide opacity-50 my-2 pl-3 border-l border-notebook-border">
    <span className="text-amber/40 mr-1.5">{'Ã— '}</span>
    <span className="line-through">{text}</span>
  </div>
);

export default MarginNote;
