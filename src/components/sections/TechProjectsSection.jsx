import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import { projects } from '../../data';
import { PROJECT_LINKS } from '../../config/links';
import { useInView } from '../../hooks/useInView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const list = projects.slice(0, 4);

const StatusBadge = ({ status }) => {
  const colors = {
    ongoing: 'bg-blueprint/15 text-blueprint/90 border-blueprint/30',
    completed: 'bg-green-500/10 text-green-400/90 border-green-500/25',
    archived: 'bg-ink-faint/10 text-ink-muted border-ink-faint/20',
  };
  const c = colors[status] || colors.archived;
  return (
    <span className={`font-mono text-[0.85rem] px-2 py-0.5 border tracking-wider uppercase ${c}`}>
      {status === 'ongoing' ? 'Active' : status}
    </span>
  );
};

const Card = ({ p, links, index }) => {
  const [animRef, animState] = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <div
      ref={animRef}
      className="relative"
      style={{
        opacity: animState.progress,
        translate: `0 ${50 * (1 - animState.progress)}px`,
        transition: 'translate 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
        perspective: '1200px',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-xl border border-ink-faint/15 bg-gradient-to-b from-notebook-surface to-notebook-bg hover:border-blueprint/25 overflow-hidden"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: 'preserve-3d',
          transition: hovered ? 'transform 0.08s ease-out, border-color 0.5s' : 'transform 0.5s ease-out, border-color 0.5s',
        }}
      >
        {/* Hover glow at base level */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blueprint/[0.03] to-transparent transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} style={{ transform: 'translateZ(0)' }} />
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blueprint/[0.04] to-transparent blur-2xl transition-opacity duration-700 ${hovered ? 'opacity-100' : 'opacity-0'}`} style={{ transform: 'translateZ(0)' }} />

        <div className="relative p-6 sm:p-8" style={{ transform: 'translateZ(20px)' }}>
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <StatusBadge status={p.status} />
                <span className="font-mono text-[0.85rem] text-ink-faint/70 tracking-wider">{p.period}</span>
              </div>
              <p className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-[0.25em]">{p.caseNumber}</p>
            </div>
            {p.icon && <p.icon size={14} className="text-ink-faint/70 group-hover:text-blueprint/60 transition-colors duration-500 shrink-0 mt-0.5" style={{ transform: 'translateZ(30px)' }} />}
          </div>

          {/* Title + subtitle */}
          <h3 className="font-editorial text-[clamp(1.2rem,2.2vw,1.8rem)] text-ink-primary leading-[1.15] mb-1 group-hover:text-white transition-colors duration-500" style={{ transform: 'translateZ(30px)' }}>
            {p.title}
          </h3>
          {p.subtitle && (
            <p className="font-mono text-[0.85rem] text-ink-muted mb-5 tracking-wide" style={{ transform: 'translateZ(25px)' }}>{p.subtitle}</p>
          )}

          {/* Objective */}
          <p className="text-[0.9rem] sm:text-[1rem] text-ink-secondary leading-relaxed tracking-[0.015em] mb-5" style={{ transform: 'translateZ(15px)' }}>{p.objective}</p>

          {/* Conditional sections */}
          {p.architecture && (
            <div className="mb-4 p-3 rounded-lg bg-ink-faint/[0.03] border border-ink-faint/10" style={{ transform: 'translateZ(10px)' }}>
              <p className="font-mono text-[0.9rem] text-ink-faint/70 uppercase tracking-wider mb-1">Architecture</p>
              <p className="font-mono text-[0.9rem] text-ink-muted leading-relaxed tracking-[0.01em]">{p.architecture}</p>
            </div>
          )}

          {p.firstAttemptFailed && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-amber/[0.03] border border-amber/15" style={{ transform: 'translateZ(10px)' }}>
              <span className="text-amber/60 font-mono text-[0.9rem] leading-none mt-0.5">Ãƒâ€”</span>
              <p className="font-mono text-[0.9rem] text-amber/70 leading-relaxed tracking-[0.01em]">{p.firstAttemptFailed}</p>
            </div>
          )}

          {p.terminalSnippet && (
            <div className="mb-4 p-3 rounded-lg bg-neutral-950/50 border border-ink-faint/10 font-mono text-[0.8rem] text-ink-muted leading-relaxed tracking-[0.01em] whitespace-pre-wrap" style={{ transform: 'translateZ(10px)' }}>
              <span className="text-ink-faint/60">{p.terminalSnippet}</span>
            </div>
          )}

          {p.annotation && (
            <p className="font-mono text-[0.9rem] text-ink-muted italic mb-4 tracking-[0.01em]" style={{ transform: 'translateZ(15px)' }}>
              <span className="text-blueprint/60 mr-1">//</span>{p.annotation}
            </p>
          )}

          {/* Metrics */}
          {p.metrics && p.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4" style={{ transform: 'translateZ(15px)' }}>
              {p.metrics.map(m => (
                <div key={m.label} className="px-3 py-2 rounded-lg bg-blueprint/[0.04] border border-blueprint/10">
                  <div className="font-mono text-[1rem] text-blueprint/80">{m.value}</div>
                  <div className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Lessons */}
          {p.lessons && p.lessons.length > 0 && (
            <div className="mb-4" style={{ transform: 'translateZ(10px)' }}>
              <p className="font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-wider mb-2">Lessons</p>
              {p.lessons.slice(0, 2).map((l, i) => (
                <p key={i} className="font-mono text-[0.9rem] text-ink-muted pl-3 border-l border-ink-faint/20 leading-relaxed tracking-[0.01em] mb-1">{l}</p>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4" style={{ transform: 'translateZ(20px)' }}>
            {p.tech.slice(0, 5).map(t => (
              <span key={t} className="font-mono text-[0.9rem] px-2 py-0.5 rounded border border-ink-faint/15 text-ink-muted bg-ink-faint/[0.02] group-hover:border-ink-faint/30 transition-colors duration-500">{t}</span>
            ))}
            {p.tech.length > 5 && (
              <span className="font-mono text-[0.9rem] text-ink-faint/60 px-2 py-0.5">+{p.tech.length - 5}</span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-2 border-t border-ink-faint/10" style={{ transform: 'translateZ(25px)' }}>
            {links?.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[0.9rem] text-ink-faint/70 hover:text-blueprint/80 transition-colors duration-300">
                <Github size={11} /> Source
              </a>
            )}
            {links?.demo && links.demo !== links?.github && (
              <a href={links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[0.9rem] text-ink-faint/70 hover:text-blueprint/80 transition-colors duration-300">
                <ExternalLink size={11} /> Demo
              </a>
            )}
            {!links?.github && !links?.demo && (
              <span className="font-mono text-[0.9rem] text-ink-faint/70">Private / Coming soon</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TechProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.05 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <section
      ref={ref}
      id="tech"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
      onMouseMove={handleMouse}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber/[0.02] to-blueprint/[0.015]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: [
          'linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '80px 80px, 80px 80px',
      }} />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 border border-amber/[0.03] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * -0.01}px)` }} />
        <div className="absolute -top-8 -right-8 w-52 h-52 border border-amber/[0.02] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * 0.015}px)` }} />
        <div className="absolute bottom-12 left-8 opacity-[0.02]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M28 4H4V28" />
            <path d="M12 4H4V12" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Scattered dots */}
        <div className="absolute top-[15%] left-[8%] w-1 h-1 rounded-full bg-amber/[0.04]" />
        <div className="absolute top-[45%] right-[10%] w-1.5 h-1.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute top-[70%] left-[15%] w-0.5 h-0.5 rounded-full bg-amber/[0.03]" />
        <div className="absolute bottom-[25%] right-[20%] w-1 h-1 rounded-full bg-blueprint/[0.02]" />

        {/* Crosshair decoration */}
        <svg className="absolute top-[25%] right-[5%] opacity-[0.015]" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="18" cy="18" r="7" />
          <path d="M18 0V11M18 25V36M7 18H0M29 18H36" />
          <path d="M7 7L11 11M29 7L25 11M7 29L11 25M29 29L25 25" strokeDasharray="1 1" />
        </svg>

        {/* Corner bracket Ã¢â‚¬â€ top-left */}
        <div className="absolute top-8 left-8 opacity-[0.015]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M4 20V4H20" />
            <path d="M4 12H8M12 4V8" strokeDasharray="1.5 1.5" />
          </svg>
        </div>
      </div>

      {/* Spotlight */}
      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
          left: mousePos.x - 250, top: mousePos.y - 250,
        }}
      />

      {/* Subtle scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <div className="absolute left-0 right-0 h-px bg-white animate-scan" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <span className={`font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-[0.2em] transition-all duration-700 mb-8 block ${inView ? 'opacity-100' : 'opacity-0'}`}>03 / Case Files</span>

          {/* Project cards */}
          <div className="space-y-6 sm:space-y-8">
            {list.map((p, i) => (
              <Card key={p.id} p={p} links={PROJECT_LINKS[p.projectKey]} index={i} />
            ))}
          </div>

          {/* Footer link */}
          <div className={`mt-12 pt-8 border-t border-ink-faint/15 flex items-center justify-between transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-wider">{list.length} of {projects.length} cases shown</span>
            <Link
              to="/projects"
              className="group flex items-center gap-2 font-mono text-[0.8rem] text-ink-muted hover:text-amber/80 transition-colors duration-300 uppercase tracking-wider"
            >
              View all cases
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient bridge to next section */}
      <div className={`relative py-5 sm:py-6 transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(245,166,35,0.015))'
        }} />
      </div>
    </section>
  );
};

export default TechProjectsSection;
