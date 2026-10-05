import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO, DocumentHeader, EditorialHeading } from '../components/common';
import PageHeader from '../components/layout/PageHeader';
import { TextAnimate } from '../components/ui/text-animate';

// 404, inside the archive shell: one h1, what happened, and where to go next.

const ROUTES = [
  { to: '/projects', label: 'Case Files' },
  { to: '/blog', label: 'Field Notes' },
  { to: '/gallery', label: 'Observations' },
  { to: '/resume', label: 'Résumé' },
];

const linkClass = 'inline-flex min-h-11 items-center gap-2 text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus';

const NotFoundPage = () => (
  <div className="min-h-screen bg-notebook-bg text-ink-primary">
    <SEO title="Entry not found (404)" description="The page you're looking for doesn't exist." noIndex />

    <PageHeader title="Not found" />

    <div className="archive-container pt-12 sm:pt-16 pb-24">
      <DocumentHeader type="ERROR 404" docRef="AV-ARCH-000" />
      <EditorialHeading as="h1" variant="page" reveal delay={80} className="mt-6">
        Entry not found
      </EditorialHeading>
      <TextAnimate by="word" animation="blurInUp" delay={0.3} className="mt-5 max-w-xl text-body-sm text-ink-secondary">
        This document doesn't exist in the archive. It may have been removed, or the reference number is incorrect.
      </TextAnimate>

      <Link
        to="/"
        className="mt-10 inline-flex min-h-11 items-center gap-3 border border-notebook-border px-5 text-small text-ink-primary transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Return to the archive <ArrowRight size={14} aria-hidden="true" />
      </Link>

      <nav aria-label="Elsewhere in the archive" className="mt-12 max-w-xl border-t border-notebook-border pt-5">
        <p className="meta-label">Or open</p>
        <ul className="mt-2 flex flex-wrap gap-x-6">
          {ROUTES.map((r) => (
            <li key={r.to}><Link to={r.to} className={linkClass}>{r.label}</Link></li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
);

export default NotFoundPage;
