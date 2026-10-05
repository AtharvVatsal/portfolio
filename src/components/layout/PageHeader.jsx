import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// The archive trail at the top of every sub-page: "← Archive / Section /
// Entry". One arrow (the icon), one treatment on every route. The global
// navigation bar sits above it; this only says where the page is filed.
//   title  the current page (last crumb)
//   trail  crumbs between the archive and the page: [{ label, to }]
const PageHeader = ({ title, trail = [] }) => (
  <nav aria-label="Breadcrumb" className="archive-container pt-6 sm:pt-8">
    <ol className="flex flex-wrap items-center gap-x-2 font-mono text-meta uppercase text-ink-faint">
      <li>
        <Link
          to="/"
          className="group inline-flex min-h-11 items-center gap-1.5 text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none" />
          Archive
        </Link>
      </li>
      {trail.map((crumb) => (
        <li key={crumb.to} className="flex items-center gap-x-2">
          <span aria-hidden="true">/</span>
          <Link
            to={crumb.to}
            className="inline-flex min-h-11 items-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {crumb.label}
          </Link>
        </li>
      ))}
      <li className="flex items-center gap-x-2">
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-ink-secondary">{title}</span>
      </li>
    </ol>
  </nav>
);

export default PageHeader;
