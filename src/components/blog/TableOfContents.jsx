import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="mb-8 border border-notebook-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <List size={16} className="text-amber" />
          <span className="font-mono text-xs text-ink-primary uppercase tracking-wider">Table of Contents</span>
          <span className="text-[10px] text-ink-faint font-mono">({headings.length})</span>
        </div>
        {isCollapsed ? (
          <ChevronDown size={16} className="text-ink-faint" />
        ) : (
          <ChevronUp size={16} className="text-ink-faint" />
        )}
      </button>

      {/* Links */}
      {!isCollapsed && (
        <div className="px-4 pb-3 space-y-0.5 border-t border-notebook-border">
          {headings.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`block w-full text-left py-1.5 transition-all duration-300 text-sm font-mono ${
                level === 3 ? 'pl-8' : 'pl-3'
              } ${
                activeId === id
                  ? 'text-blueprint bg-blueprint/5'
                  : 'text-ink-faint hover:text-ink-primary hover:bg-surface'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TableOfContents;
