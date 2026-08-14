import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { RESUME_LINK } from '../../config/links';

const navItems = [
  { ref: '01', name: 'About', type: 'scroll', section: 'about' },
  { ref: '02', name: 'Projects', type: 'scroll', section: 'tech' },
  { ref: '03', name: 'Gallery', type: 'link', to: '/gallery' },
  { ref: '04', name: 'Blog', type: 'link', to: '/blog' },
  { ref: '05', name: 'Resume', type: 'link', to: '/resume' },
  { ref: '06', name: 'Contact', type: 'scroll', section: 'contact' },
];

const Navbar = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  showNavbar,
  scrollToSection,
}) => {
  const { cycleTheme } = useTheme();
  const location = useLocation();
  const isOnSubPage = location.pathname !== '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setIsMenuOpen]);

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_LINK;
    link.download = 'Atharv_Vatsal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavClick = (item) => {
    if (item.type === 'scroll') {
      if (isOnSubPage) {
        window.location.href = '/#' + item.section;
      } else {
        scrollToSection(item.section);
      }
    }
    setIsMenuOpen(false);
  };

  const isItemActive = (item) => {
    if (item.type === 'link') return location.pathname === item.to;
    return activeSection === item.section;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          showNavbar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        {/* Top glow line Ã¢â‚¬â€ appears on scroll */}
        <div className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-700 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`} style={{
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(99,102,241,0.3), rgba(99,102,241,0.15), transparent)',
        }} />

        <div className="relative" style={{
          background: scrolled
            ? 'rgba(10,9,8,0.92)'
            : 'rgba(10,9,8,0.75)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          borderBottom: '0.5px solid rgba(40,37,31,0.4)',
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.3)' : 'none',
          transition: 'background 0.7s, box-shadow 0.7s',
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">

              {/* Brand Ã¢â‚¬â€ archival mark */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 group shrink-0"
              >
                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 border" style={{ borderColor: 'rgba(99,102,241,0.15)' }} />
                  <div className="absolute -inset-1 bg-gradient-to-br from-blueprint/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img src="/av.svg" alt="AV" className="w-4 h-4 object-contain relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r border-b" style={{ borderColor: 'rgba(99,102,241,0.08)' }} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-mono text-[0.85rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(140,134,125,0.5)' }}>
                    Archive
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ backgroundColor: scrolled ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.3)' }} />
                    <span className="font-mono text-[0.8rem] text-ink-primary font-medium tracking-tight">AV</span>
                    <span className="font-mono text-[0.9rem] tracking-[0.15em]" style={{ color: 'rgba(140,134,125,0.25)' }}>
                      Ã‚Â· ARCH-001
                    </span>
                  </div>
                </div>
              </Link>

              {/* Desktop nav Ã¢â‚¬â€ precision instrument style */}
              <div className="hidden lg:flex items-center">
                <div className="flex items-center">
                  {navItems.map((item, i) => {
                    const active = isItemActive(item);
                    return (
                      <React.Fragment key={i}>
                        {item.type === 'link' ? (
                          <Link
                            to={item.to}
                            className="group relative px-2.5 py-2"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className={`flex items-center gap-2 transition-all duration-300 ${
                              active ? 'translate-y-0' : 'group-hover:-translate-y-px'
                            }`}>
                              <span className={`font-mono text-[0.8rem] tracking-wider transition-all duration-300 ${
                                active
                                  ? 'text-blueprint'
                                  : 'text-ink-faint/60 group-hover:text-ink-faint/70'
                              }`}>
                                {item.ref}
                              </span>
                              <span className={`relative text-sm tracking-[0.01em] transition-all duration-300 ${
                                active
                                  ? 'text-ink-primary font-medium'
                                  : 'text-ink-muted/80 group-hover:text-ink-primary'
                              }`}>
                                {active && (
                                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-blueprint/50 font-mono text-[0.85rem] transition-opacity duration-300">[</span>
                                )}
                                {item.name}
                                {active && (
                                  <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-blueprint/50 font-mono text-[0.85rem] transition-opacity duration-300">]</span>
                                )}
                              </span>
                            </div>
                            {/* Hover underline Ã¢â‚¬â€ precise, mechanical */}
                            <div className={`absolute bottom-0 left-2 right-2 h-px transition-all duration-300 ${
                              active
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100'
                            }`} style={{
                              background: active
                                ? 'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(99,102,241,0.05))'
                                : 'linear-gradient(90deg, rgba(140,134,125,0.3), transparent)',
                            }} />
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleNavClick(item)}
                            className="group relative px-2.5 py-2"
                          >
                            <div className={`flex items-center gap-2 transition-all duration-300 ${
                              active ? 'translate-y-0' : 'group-hover:-translate-y-px'
                            }`}>
                              <span className={`font-mono text-[0.8rem] tracking-wider transition-all duration-300 ${
                                active
                                  ? 'text-blueprint'
                                  : 'text-ink-faint/60 group-hover:text-ink-faint/70'
                              }`}>
                                {item.ref}
                              </span>
                              <span className={`relative text-sm tracking-[0.01em] transition-all duration-300 ${
                                active
                                  ? 'text-ink-primary font-medium'
                                  : 'text-ink-muted/80 group-hover:text-ink-primary'
                              }`}>
                                {active && (
                                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-blueprint/50 font-mono text-[0.85rem]">[</span>
                                )}
                                {item.name}
                                {active && (
                                  <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-blueprint/50 font-mono text-[0.85rem]">]</span>
                                )}
                              </span>
                            </div>
                            <div className={`absolute bottom-0 left-2 right-2 h-px transition-all duration-300 ${
                              active
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100'
                            }`} style={{
                              background: active
                                ? 'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(99,102,241,0.05))'
                                : 'linear-gradient(90deg, rgba(140,134,125,0.3), transparent)',
                            }} />
                          </button>
                        )}
                        {/* Divider dot between items */}
                        {i < navItems.length - 1 && (
                          <span className="mx-1 w-0.5 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(140,134,125,0.15)' }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={cycleTheme}
                  className="relative hidden lg:flex items-center justify-center w-8 h-8 border transition-all duration-300 group"
                  style={{ borderColor: 'rgba(40,37,31,0.5)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(40,37,31,0.5)'}
                  aria-label="Switch theme"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blueprint/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-2 h-2 rounded-full transition-all duration-500" style={{
                    backgroundColor: scrolled ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.3)',
                    boxShadow: scrolled ? '0 0 6px rgba(99,102,241,0.3)' : 'none',
                  }} />
                </button>

                <div className="hidden lg:flex items-center">
                  <span className="w-px h-4 mx-1" style={{ backgroundColor: 'rgba(40,37,31,0.4)' }} />
                </div>

                <button
                  onClick={handleResumeDownload}
                  className="relative hidden lg:flex items-center gap-2 px-3 py-1.5 border transition-all duration-300 group"
                  style={{ borderColor: 'rgba(40,37,31,0.5)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(40,37,31,0.5)'}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blueprint/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Download size={10} className="relative text-ink-muted group-hover:text-blueprint transition-colors duration-300" />
                  <span className="relative text-sm text-ink-muted group-hover:text-ink-primary transition-colors duration-300">Resume</span>
                  <span className="relative font-mono text-[0.9rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.35)' }}>PDF</span>
                </button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden relative w-9 h-9 flex items-center justify-center transition-colors duration-300"
                  style={{ color: isMenuOpen ? 'rgba(99,102,241,0.7)' : 'rgba(245,242,237,0.5)' }}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <div className="absolute inset-0 border border-transparent hover:border-notebook-border-light transition-colors duration-300" />
                  <div className="relative w-4 h-3.5 flex flex-col justify-between">
                    <span className={`block h-px w-full bg-current transition-all duration-300 origin-center ${
                      isMenuOpen ? 'translate-y-[6.5px] rotate-45' : ''
                    }`} />
                    <span className={`block h-px bg-current transition-all duration-300 ${
                      isMenuOpen ? 'w-0 opacity-0' : 'w-full'
                    }`} />
                    <span className={`block h-px w-full bg-current transition-all duration-300 origin-center ${
                      isMenuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
                    }`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom graduated dot pattern */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-[3px] px-4 overflow-hidden h-px">
            {Array.from({ length: 120 }).map((_, i) => (
              <span key={i} className="w-px h-px" style={{
                backgroundColor: `rgba(99,102,241,${0.02 + Math.sin(i * 0.15) * 0.02})`,
              }} />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu Ã¢â‚¬â€ full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0" style={{
          background: 'rgba(10,9,8,0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
        }} />
      </div>

      {/* Mobile menu panel */}
      <div
        className={`fixed top-14 left-0 right-0 z-50 lg:hidden transition-all duration-500 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="px-4 sm:px-6 pt-2 pb-8">
          <div className="border" style={{ borderColor: 'rgba(40,37,31,0.4)' }}>
            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(40,37,31,0.3)' }}>
              <span className="font-mono text-[0.85rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(140,134,125,0.4)' }}>
                Archive Index
              </span>
              <span className="font-mono text-[0.9rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.15)' }}>
                AV-ARCH-NAV
              </span>
            </div>

            {/* Nav items */}
            <div className="py-2">
              {navItems.map((item, i) => {
                const active = isItemActive(item);
                return (
                  <React.Fragment key={i}>
                    {item.type === 'link' ? (
                      <Link
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center gap-4 px-5 py-3.5 transition-all duration-300"
                        style={{
                          background: active ? 'rgba(99,102,241,0.04)' : 'transparent',
                          borderLeft: active ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className={`font-mono text-[0.9rem] w-6 text-center transition-all duration-300 ${
                          active ? 'text-blueprint' : 'text-ink-faint/70 group-hover:text-ink-faint/60'
                        }`}>
                          {item.ref}
                        </span>
                        <span className={`text-sm transition-all duration-300 ${
                          active ? 'text-ink-primary font-medium' : 'text-ink-muted group-hover:text-ink-primary'
                        }`}>
                          {item.name}
                        </span>
                        <svg className={`ml-auto w-3 h-3 transition-all duration-300 ${
                          active ? 'text-blueprint/50' : 'text-ink-faint/60 group-hover:text-ink-faint/70'
                        }`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3L11 8L6 13" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item)}
                        className="group flex items-center gap-4 w-full px-5 py-3.5 text-left transition-all duration-300"
                        style={{
                          background: active ? 'rgba(99,102,241,0.04)' : 'transparent',
                          borderLeft: active ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className={`font-mono text-[0.9rem] w-6 text-center transition-all duration-300 ${
                          active ? 'text-blueprint' : 'text-ink-faint/70 group-hover:text-ink-faint/60'
                        }`}>
                          {item.ref}
                        </span>
                        <span className={`text-sm transition-all duration-300 ${
                          active ? 'text-ink-primary font-medium' : 'text-ink-muted group-hover:text-ink-primary'
                        }`}>
                          {item.name}
                        </span>
                      </button>
                    )}
                    {i < navItems.length - 1 && (
                      <div className="mx-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(40,37,31,0.2), rgba(40,37,31,0.05), transparent)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="border-t flex" style={{ borderColor: 'rgba(40,37,31,0.3)' }}>
              <button
                onClick={() => { cycleTheme(); setIsMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm transition-all duration-300"
                style={{ color: 'rgba(140,134,125,0.5)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(245,242,237,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(140,134,125,0.5)'}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(99,102,241,0.4)' }} />
                <span className="font-mono text-[0.9rem] tracking-widest uppercase">Swatch</span>
              </button>
              <div className="w-px" style={{ backgroundColor: 'rgba(40,37,31,0.3)' }} />
              <button
                onClick={() => { handleResumeDownload(); setIsMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm transition-all duration-300"
                style={{ color: 'rgba(140,134,125,0.5)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(245,242,237,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(140,134,125,0.5)'}
              >
                <Download size={12} />
                <span className="font-mono text-[0.9rem] tracking-widest uppercase">Resume</span>
                <span className="font-mono text-[0.9rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.25)' }}>.pdf</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
