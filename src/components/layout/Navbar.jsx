import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Download, Menu, X } from 'lucide-react';
import { RESUME_LINK } from '../../config/links';

// The archive's one navigation bar, on every route. Always visible (no
// scroll-hiding), no decorative numbering, dots or status lights: names,
// a clear active state and a visible focus ring.
// Sections of the home page (About, Contact) are reached by hash: on the home
// page the bar scrolls to them; elsewhere it routes to "/#section" and the
// home page scrolls on arrival.

const NAV = [
  { name: 'About', section: 'about' },
  { name: 'Case Files', to: '/projects' },
  { name: 'Field Notes', to: '/blog' },
  { name: 'Observations', to: '/gallery' },
  { name: 'Résumé', to: '/resume' },
  { name: 'Contact', section: 'contact' },
];

const HOME_SECTIONS = ['about', 'contact'];

// Which home section is under the middle of the screen. One observer; the
// lazily loaded sections are picked up as they mount.
const useActiveHomeSection = (enabled) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) { setActive(null); return undefined; }
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
        else setActive((cur) => (cur === e.target.id ? null : cur));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    const attach = () => {
      HOME_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !seen.has(el)) { seen.add(el); io.observe(el); }
      });
      return seen.size === HOME_SECTIONS.length;
    };
    let mo = null;
    if (!attach()) {
      mo = new MutationObserver(() => { if (attach()) mo.disconnect(); });
      mo.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });
    }
    return () => { io.disconnect(); if (mo) mo.disconnect(); };
  }, [enabled]);
  return active;
};

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  return true;
};

const itemClass = (active) => `relative inline-flex min-h-11 items-center px-2.5 text-small transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
  active
    ? 'text-ink-primary after:absolute after:inset-x-2.5 after:bottom-2 after:h-px after:bg-accent'
    : 'text-ink-muted hover:text-ink-primary'
}`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const activeSection = useActiveHomeSection(onHome);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback((returnFocus) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Close on route change.
  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);

  // Open: hold the page still, focus the first entry; Escape closes.
  useEffect(() => {
    if (!open) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a, button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  const goToSection = (id) => {
    setOpen(false);
    if (onHome && scrollToSection(id)) {
      window.history.replaceState(null, '', `#${id}`);
      return;
    }
    navigate(`/#${id}`);
  };

  const isActive = (item) => (item.to
    ? location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
    : onHome && activeSection === item.section);

  const renderItem = (item, className, onClick) => (item.to ? (
    <Link
      key={item.name}
      to={item.to}
      aria-current={isActive(item) ? 'page' : undefined}
      className={className(isActive(item))}
      onClick={onClick}
    >
      {item.name}
    </Link>
  ) : (
    <a
      key={item.name}
      href={`/#${item.section}`}
      aria-current={isActive(item) ? 'location' : undefined}
      className={className(isActive(item))}
      onClick={(e) => { e.preventDefault(); goToSection(item.section); }}
    >
      {item.name}
    </a>
  ));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-notebook-border bg-notebook-bg">
      <div className="archive-container flex h-14 items-center justify-between gap-6">
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center border border-notebook-border font-editorial text-small text-accent">
            AV
          </span>
          <span className="text-small text-ink-primary">Atharv Vatsal</span>
        </Link>

        <nav aria-label="Archive" className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => <li key={item.name}>{renderItem(item, itemClass)}</li>)}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={RESUME_LINK}
            download="Atharv_Vatsal_Resume.pdf"
            className="hidden min-h-11 items-center gap-2 px-2.5 text-small text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:inline-flex"
          >
            <Download size={14} aria-hidden="true" />
            Résumé <span className="font-mono text-meta text-ink-faint">PDF</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="inline-flex h-11 items-center gap-2 px-2 text-small text-ink-secondary transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Phones and tablets: a plain panel under the bar. Hidden (not just
          transparent) when closed, so it is out of the tab order. */}
      <div
        className={`fixed inset-x-0 bottom-0 top-14 bg-notebook-bg/80 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={() => close(false)}
        aria-hidden="true"
      />
      <nav
        id="site-menu"
        ref={panelRef}
        aria-label="Archive"
        className={`absolute inset-x-0 top-14 border-b border-notebook-border bg-notebook-bg lg:hidden ${open ? 'block' : 'hidden'}`}
      >
        <ul className="archive-container py-3">
          {NAV.map((item) => (
            <li key={item.name} className="border-b border-notebook-border last:border-b-0">
              {renderItem(item, (active) => `flex min-h-12 items-center justify-between text-body transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${
                active ? 'text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'
              }`, () => setOpen(false))}
            </li>
          ))}
          <li className="pt-3">
            <a
              href={RESUME_LINK}
              download="Atharv_Vatsal_Resume.pdf"
              className="inline-flex min-h-11 items-center gap-2 text-small text-ink-muted hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Download size={14} aria-hidden="true" />
              Résumé <span className="font-mono text-meta text-ink-faint">PDF</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
