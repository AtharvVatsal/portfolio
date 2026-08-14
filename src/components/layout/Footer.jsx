import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Camera } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/links';
import { footerMeta, archiveMeta } from '../../data/archiveMeta';
import RevisionTimeline from '../common/RevisionTimeline';

const daysSince = (dateStr) => {
  const [year, month] = dateStr.split('-').map(Number);
  const then = new Date(year, month - 1, 1);
  const now = new Date();
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  return diff;
};

const Footer = () => {
  const socialLinks = [
    { icon: Github, link: SOCIAL_LINKS.github, label: 'GitHub' },
    { icon: Linkedin, link: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    { icon: Instagram, link: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { icon: Camera, link: SOCIAL_LINKS.photography, label: 'Photography' },
  ];

  const lastUpdated = useMemo(() => {
    const days = daysSince(archiveMeta.lastUpdated);
    if (days < 1) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }, []);

  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSession = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-notebook-border">
      {/* Subtle top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-faint/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Colophon */}
        <div className="py-8 sm:py-12">
          {/* Top section — links and social */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8 sm:mb-10">
            {/* Archive reference */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="meta-label">
                  Colophon
                </span>
              </div>
              <p className="max-reading text-body-sm text-ink-muted">
                {footerMeta.buildNote}
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink-primary border border-notebook-border hover:border-notebook-border-light transition-all duration-300"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Status line — living archive indicator */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
            <span className="meta-label text-ink-muted">
              Archive updated {lastUpdated}
            </span>
          </div>

          {/* System status — uptime and archive version */}
          <div className="flex items-center gap-4 mb-6 text-meta font-mono text-ink-faint/70">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 border border-current opacity-50" />
              SYS-ACTIVE
            </span>
            <span className="text-notebook-border/60">|</span>
            <span className="tabular-nums">UP {formatSession(sessionTime)}</span>
            <span className="text-notebook-border/60 hidden sm:inline">|</span>
            <span className="hidden sm:inline">ARCH v{archiveMeta.version}</span>
          </div>

          {/* Divider */}
          <div className="ref-line mb-6 sm:mb-8" />

          {/* Middle section — Revision history */}
          <div className="mb-8 sm:mb-10 max-w-md">
            <RevisionTimeline revisions={footerMeta.revisionHistory} />
          </div>

          {/* Divider */}
          <div className="ref-line mb-6 sm:mb-8" />

          {/* Bottom section — metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Page links — archive navigation */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                { name: 'Field Notes', to: '/blog' },
                { name: 'Case Files', to: '/projects' },
                { name: 'Observations', to: '/gallery' },
                { name: 'Growth Record', to: '/resume' },
              ].map((page) => (
                <Link
                  key={page.name}
                  to={page.to}
                  className="font-mono text-meta text-ink-muted hover:text-ink-primary transition-colors duration-300 uppercase tracking-wider"
                >
                  {page.name}
                </Link>
              ))}
            </div>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="font-mono text-meta text-ink-muted hover:text-ink-primary transition-colors duration-300 uppercase tracking-wider"
            >
              ↑ Top
            </button>
          </div>

          {/* Copyright — minimal */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-notebook-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="meta-label">
                © {new Date().getFullYear()} Atharv Vatsal
              </p>
              <p className="meta-label">
                v4.0 — Built with React + Tailwind
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
