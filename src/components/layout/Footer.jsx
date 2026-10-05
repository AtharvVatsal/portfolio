import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Camera } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/links';
import { footerMeta, archiveMeta } from '../../data/archiveMeta';
import RevisionTimeline from '../common/RevisionTimeline';

// The archive's colophon, on every route. Only authored, static information:
// what the archive is, where its sections are, where else to find the author,
// and the revision record. No live status, timers or counters.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const revised = (() => {
  const [y, m] = (archiveMeta.lastUpdated || '').split('-').map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : null;
})();

const SECTIONS = [
  { name: 'Archive', to: '/' },
  { name: 'Case Files', to: '/projects' },
  { name: 'Field Notes', to: '/blog' },
  { name: 'Observations', to: '/gallery' },
  { name: 'Résumé', to: '/resume' },
];

const SOCIAL = [
  { icon: Github, link: SOCIAL_LINKS.github, label: 'GitHub' },
  { icon: Linkedin, link: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: Instagram, link: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Camera, link: SOCIAL_LINKS.photography, label: 'Photography' },
];

const linkClass = 'inline-flex min-h-11 items-center text-small text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const Footer = () => {
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  };

  return (
    <footer className="border-t border-notebook-border">
      <div className="archive-container py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
          <div>
            <p className="font-editorial text-title text-ink-primary">{archiveMeta.title}</p>
            <p className="mt-3 max-w-md text-small text-ink-muted">{footerMeta.buildNote}</p>
          </div>

          <nav aria-label="Archive sections">
            <p className="font-mono text-meta uppercase text-ink-faint">Sections</p>
            <ul className="mt-2">
              {SECTIONS.map((s) => (
                <li key={s.to}><Link to={s.to} className={linkClass}>{s.name}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-meta uppercase text-ink-faint">Elsewhere</p>
            <ul className="mt-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-2.5`}>
                    <s.icon size={14} aria-hidden="true" />
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-notebook-border pt-8 max-w-md">
          <RevisionTimeline revisions={footerMeta.revisionHistory} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-notebook-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-meta text-ink-faint">
            © {new Date().getFullYear()} Atharv Vatsal
            {revised && <> &middot; revised {revised}</>}
            {' '}&middot; v{archiveMeta.version}
          </p>
          <button type="button" onClick={toTop} className={linkClass}>
            Back to top <span aria-hidden="true" className="ml-1.5">&uarr;</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
