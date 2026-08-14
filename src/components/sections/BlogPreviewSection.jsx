import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data';
import { useInView } from '../../hooks/useInView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const latest = blogPosts.slice(0, 3);

const TiltCard = ({ post, index }) => {
  const [scrollAnimRef, scrollAnim] = useScrollAnimation({ rootMargin: '0px 0px -80px 0px' });
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: y * -12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={scrollAnimRef}
      className="group"
      style={{ perspective: '1200px' }}
    >
      <Link
        to={`/blog/${post.slug}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative block"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
      >
        <div className="relative border border-ink-faint/10 bg-notebook-bg/40 backdrop-blur-sm overflow-hidden"
          style={{
            opacity: scrollAnim.progress,
            transform: `translateX(${(index % 2 === 0 ? 200 : -200) * (1 - scrollAnim.progress)}px)`,
            transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Cover image Ã¢â‚¬â€ 3D depth layer */}
            {post.coverImage && (
              <div className="sm:w-44 lg:w-52 flex-shrink-0 relative overflow-hidden bg-notebook-surface"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="relative h-36 sm:h-full overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale-[30%]'
                    }`}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-notebook-bg/60 to-transparent transition-opacity duration-500 ${
                    isHovered ? 'opacity-0' : 'opacity-100'
                  }`} />
                </div>
                {/* Notebook page corner fold */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-notebook-bg to-transparent opacity-60" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 sm:p-6 lg:p-7"
              style={{ transform: 'translateZ(30px)' }}
            >
              {/* Reference line */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[0.85rem] text-blueprint/80 uppercase tracking-[0.2em]">{post.category}</span>
                <span className="w-4 h-px bg-blueprint/20" />
                <span className="font-mono text-[0.85rem] text-ink-faint/60">{post.date}</span>
                <span className="font-mono text-[0.85rem] text-ink-faint/60">Ã‚Â· {post.readTime}</span>
              </div>

              <h3 className={`font-editorial text-[clamp(1rem,1.8vw,1.4rem)] text-ink-primary mb-2 leading-[1.2] transition-colors duration-300 ${
                isHovered ? 'text-blueprint-light' : ''
              }`}>
                {post.title}
              </h3>

              <p className="text-[0.85rem] sm:text-[0.9rem] text-ink-secondary leading-relaxed tracking-[0.015em] line-clamp-2 mb-4">
                {post.excerpt}
              </p>

              {/* Tags + Read link */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="font-mono text-[0.85rem] px-1.5 py-0.5 border border-ink-faint/15 text-ink-faint/60 tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={`flex items-center gap-1.5 font-mono text-[0.9rem] uppercase tracking-[0.15em] transition-all duration-300 ${
                  isHovered ? 'text-blueprint translate-x-1' : 'text-ink-faint/60'
                }`}>
                  Read
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3L10 8L5 13" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom reference line Ã¢â‚¬â€ activates on hover */}
          <div className={`h-px bg-gradient-to-r from-blueprint/40 to-transparent transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </Link>
    </div>
  );
};

const BlogPreviewSection = () => {
  const [inViewRef, inView] = useInView({ threshold: 0.05 });
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      ref={(node) => {
        inViewRef.current = node;
        sectionRef.current = node;
      }}
      onMouseMove={handleSectionMouse}
      id="blog"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      {/* Deep ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint/[0.015] to-blueprint/[0.01]" />

      {/* Blueprint grid Ã¢â‚¬â€ subtle */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ring 1 - top right */}
        <div className={`absolute -top-20 -right-20 w-72 h-72 border border-blueprint/[0.03] rounded-full transition-all duration-1000`}
          style={{
            transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * -0.01}px)`,
          }}
        />
        <div className={`absolute -top-10 -right-10 w-52 h-52 border border-blueprint/[0.02] rounded-full transition-all duration-1000`}
          style={{
            transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * 0.015}px)`,
          }}
        />

        {/* Floating dots */}
        <div className="absolute top-1/4 left-[12%] w-1 h-1 rounded-full bg-blueprint/[0.04]" />
        <div className="absolute top-3/4 right-[15%] w-1.5 h-1.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute top-1/3 right-[8%] w-0.5 h-0.5 rounded-full bg-ink-faint/[0.04]" />
        <div className="absolute top-[45%] left-[5%] w-0.5 h-0.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute bottom-[20%] right-[8%] w-1 h-1 rounded-full bg-blueprint/[0.02]" />
        <div className="absolute top-[15%] left-[25%] w-0.5 h-0.5 rounded-full bg-amber/[0.025]" />

        {/* Line decorations */}
        <svg className="absolute top-1/2 left-[5%] opacity-[0.015]" width="60" height="120" viewBox="0 0 60 120" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M30 0V40M10 20H50M30 40L10 60M30 40L50 60M30 80V120M10 100H50" />
        </svg>

        {/* Corner brackets - bottom left */}
        <div className="absolute bottom-12 left-8 opacity-[0.025]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M20 4H4V20" />
          </svg>
        </div>

        {/* Crosshair decoration */}
        <svg className="absolute top-[60%] left-[3%] opacity-[0.012]" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="16" cy="16" r="6" />
          <path d="M16 0V10M16 22V32M10 16H0M22 16H32" />
        </svg>
      </div>

      {/* Spotlight that follows mouse */}
      <div
        className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <span className={`font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-[0.2em] transition-all duration-700 mb-8 block ${inView ? 'opacity-100' : 'opacity-0'}`}>04 / Field Notes</span>

        {/* Cards */}
        <div className="space-y-5">
          {latest.map((post, i) => (
            <TiltCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-10 pt-8 border-t border-ink-faint/10 flex items-center justify-between transition-all duration-700 delay-500 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <span className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-wider">
            {blogPosts.length - latest.length} more archived
          </span>
          <Link
            to="/blog"
            className="group flex items-center gap-2 font-mono text-[0.9rem] text-ink-muted hover:text-amber/80 transition-colors duration-300 uppercase tracking-wider"
          >
            Browse archive
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M6 3L11 8L6 13" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Gradient bridge to next section */}
      <div className={`relative py-5 sm:py-6 transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.012))'
        }} />
      </div>
    </section>
  );
};

export default BlogPreviewSection;
