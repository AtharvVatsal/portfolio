import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Track which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
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
    <nav className="mb-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <List size={18} className="text-amber-400" />
          <span className="font-medium text-white text-sm">Table of Contents</span>
          <span className="text-xs text-gray-500">({headings.length})</span>
        </div>
        {isCollapsed ? (
          <ChevronDown size={18} className="text-gray-500" />
        ) : (
          <ChevronUp size={18} className="text-gray-500" />
        )}
      </button>

      {/* Links */}
      {!isCollapsed && (
        <div className="px-5 pb-4 space-y-1">
          {headings.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`block w-full text-left py-1.5 rounded-lg transition-all duration-300 text-sm ${
                level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === id
                  ? 'text-amber-400 bg-amber-400/10 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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