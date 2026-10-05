import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav aria-label="Contents" className="mb-10 border border-notebook-border">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="toc-list"
        className="flex min-h-12 w-full items-center justify-between px-4 transition-colors duration-200 hover:bg-notebook-surface focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
      >
        <span className="flex items-center gap-3">
          <span className="meta-label">Contents</span>
          <span className="font-mono text-meta text-ink-faint">{headings.length}</span>
        </span>
        {isCollapsed ? (
          <ChevronDown size={16} aria-hidden="true" className="text-ink-faint" />
        ) : (
          <ChevronUp size={16} aria-hidden="true" className="text-ink-faint" />
        )}
      </button>

      {!isCollapsed && (
        <ol id="toc-list" className="border-t border-notebook-border px-2 py-2">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); handleClick(id); }}
                aria-current={activeId === id ? 'location' : undefined}
                className={`flex min-h-11 items-center py-1.5 pr-2 text-small transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${
                  level === 3 ? 'pl-8' : 'pl-3'
                } ${
                  activeId === id
                    ? 'border-l border-accent text-ink-primary'
                    : 'border-l border-transparent text-ink-muted hover:text-ink-primary'
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

export default TableOfContents;
