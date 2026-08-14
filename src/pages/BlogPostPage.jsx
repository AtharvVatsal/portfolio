import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Home,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { blogPosts } from '../data';
import { SEO } from '../components/common';
import { MarkdownRenderer, extractHeadings, TableOfContents } from '../components/blog';
import { ArticleSkeleton } from '../components/common/Skeleton';
import { useInView } from '../hooks/useInView';

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, once: true });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        translate: inView ? '0 0' : '0 24px',
        willChange: 'transform, opacity',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, translate 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const TagPill = ({ tag }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[0.9rem] tracking-wider cursor-default"
      style={{
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.3)' : 'rgba(40,37,31,0.35)'}`,
        color: hovered ? 'rgba(99,102,241,0.7)' : 'rgba(140,134,125,0.55)',
        background: hovered ? 'rgba(99,102,241,0.04)' : 'transparent',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {tag}
    </span>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [readProgress, setReadProgress] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const lastScrollY = useRef(0);
  const articleRef = useRef(null);

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const post = blogPosts[currentIndex];
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const relatedPosts = post
    ? blogPosts
        .filter(p => p.id !== post.id)
        .map(p => ({ ...p, relevance: p.tags.filter(t => post.tags.includes(t)).length }))
        .filter(p => p.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 2)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setImageError(false);
  }, [slug]);

  useEffect(() => {
    if (!post?.markdownFile) {
      setIsLoadingContent(false);
      setContentError(true);
      return;
    }
    setIsLoadingContent(true);
    setContentError(false);
    setMarkdownContent('');
    fetch(post.markdownFile)
      .then(res => { if (!res.ok) throw new Error(); return res.text(); })
      .then(text => { setMarkdownContent(text); setIsLoadingContent(false); })
      .catch(() => { setContentError(true); setIsLoadingContent(false); });
  }, [post]);

  // Scroll-based header hide/show + reading progress
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setParallaxY(Math.min(sy * 0.2, 120));

      if (sy > 300) {
        setHeaderHidden(sy > lastScrollY.current);
      } else {
        setHeaderHidden(false);
      }
      lastScrollY.current = sy;

      const article = articleRef.current;
      if (article) {
        const top = article.offsetTop;
        const h = article.offsetHeight;
        const wh = window.innerHeight;
        const start = top - wh * 0.2;
        const end = top + h - wh * 0.5;
        const cur = sy - start;
        const tot = end - start;
        setReadProgress(Math.min(Math.max((cur / tot) * 100, 0), 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevPost) navigate(`/blog/${prevPost.slug}`);
      else if (e.key === 'ArrowRight' && nextPost) navigate(`/blog/${nextPost.slug}`);
      else if (e.key === 'Escape') navigate('/blog');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPost, nextPost, navigate]);

  // Mouse spotlight
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-notebook-bg text-ink-primary">
        <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." noIndex />
        <div className="text-center py-32">
          <div className="meta-label text-ink-muted mb-4">// 404</div>
          <h1 className="font-editorial text-3xl text-ink-primary mb-3">Entry Not Found</h1>
          <p className="text-body-sm text-ink-muted mb-8 max-w-md mx-auto">The research note you're looking for doesn't exist or has been archived.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 border border-notebook-border text-ink-secondary hover:text-ink-primary hover:border-blueprint transition-all duration-300 text-meta font-mono">
            <ArrowLeft size={16} />
            Return to Logbook
          </Link>
        </div>
      </div>
    );
  }

  const hasValidImage = post.coverImage && !imageError;
  const headings = markdownContent ? extractHeadings(markdownContent) : [];

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary" onMouseMove={handleMouseMove}>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        url={`/blog/${post.slug}`}
        type="article"
        keywords={post.tags}
        article={{ publishedTime: parseDate(post.date), tags: post.tags, author: 'Atharv Vatsal' }}
      />

      {/* ===================== BACKGROUND AMBIENT ELEMENTS ===================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.012]" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />

        {/* Rings */}
        <div className="absolute top-[15%] -right-32 w-96 h-96 border border-blueprint/[0.02] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.008}px, ${mousePos.y * -0.008}px)` }} />
        <div className="absolute top-[25%] -right-16 w-64 h-64 border border-blueprint/[0.015] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.012}px, ${mousePos.y * 0.012}px)` }} />
        <div className="absolute bottom-[20%] -left-32 w-80 h-80 border border-amber/[0.015] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)` }} />

        {/* Dots */}
        <div className="absolute top-[20%] left-[8%] w-1 h-1 rounded-full bg-blueprint/[0.04]" />
        <div className="absolute top-[40%] right-[12%] w-1.5 h-1.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute top-[60%] left-[5%] w-0.5 h-0.5 rounded-full bg-amber/[0.03]" />
        <div className="absolute bottom-[30%] right-[8%] w-1 h-1 rounded-full bg-blueprint/[0.025]" />
        <div className="absolute top-[75%] left-[15%] w-0.5 h-0.5 rounded-full bg-ink-faint/[0.03]" />
        <div className="absolute top-[10%] right-[25%] w-0.5 h-0.5 rounded-full bg-blueprint/[0.03]" />

        {/* Crosshair */}
        <svg className="absolute top-[30%] left-[3%] opacity-[0.012]" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="20" cy="20" r="8" />
          <path d="M20 0V12M20 28V40M12 20H0M28 20H40" />
        </svg>

        {/* Corner bracket */}
        <div className="absolute bottom-16 right-10 opacity-[0.02]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 24V4H24" />
          </svg>
        </div>

        {/* Engineering line art */}
        <svg className="absolute top-[55%] right-[4%] opacity-[0.01]" width="50" height="80" viewBox="0 0 50 80" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M25 0V30M10 15H40M25 30L10 45M25 30L40 45M25 50V80" />
        </svg>

        {/* Mouse spotlight */}
        <div
          className="absolute transition-all duration-[800ms] ease-out"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.025) 0%, transparent 70%)',
            left: mousePos.x - 250,
            top: mousePos.y - 250,
          }}
        />
      </div>

      {/* ===================== READING PROGRESS ===================== */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
        <div className="h-full relative" style={{ background: 'rgba(40,37,31,0.12)' }}>
          <div
            className="h-full absolute top-0 left-0 transition-all duration-150 ease-out"
            style={{
              width: `${readProgress}%`,
              background: 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(99,102,241,0.2) 80%, transparent)',
              boxShadow: '0 0 10px rgba(99,102,241,0.1)',
            }}
          />
        </div>
      </div>

      {/* ===================== STICKY HEADER ===================== */}
      <header
        className="fixed top-0.5 left-0 right-0 z-50 transition-all duration-300"
        style={{
          translate: headerHidden ? '0 -100%' : '0 0',
          background: 'rgba(10,9,8,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(40,37,31,0.2)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-ink-muted hover:text-ink-primary transition-colors duration-300 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono text-[0.9rem] uppercase tracking-widest">All Notes</span>
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => prevPost && navigate(`/blog/${prevPost.slug}`)} disabled={!prevPost}
              className="p-1.5 transition-all duration-300"
              style={{ color: prevPost ? 'rgba(140,134,125,0.4)' : 'rgba(140,134,125,0.35)', cursor: prevPost ? 'pointer' : 'not-allowed' }}
              onMouseEnter={(e) => { if (prevPost) e.currentTarget.style.color = 'rgba(245,242,237,0.7)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = prevPost ? 'rgba(140,134,125,0.4)' : 'rgba(140,134,125,0.35)'; }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-[0.85rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.45)' }}>
              {currentIndex + 1} / {blogPosts.length}
            </span>
            <button onClick={() => nextPost && navigate(`/blog/${nextPost.slug}`)} disabled={!nextPost}
              className="p-1.5 transition-all duration-300"
              style={{ color: nextPost ? 'rgba(140,134,125,0.4)' : 'rgba(140,134,125,0.35)', cursor: nextPost ? 'pointer' : 'not-allowed' }}
              onMouseEnter={(e) => { if (nextPost) e.currentTarget.style.color = 'rgba(245,242,237,0.7)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = nextPost ? 'rgba(140,134,125,0.4)' : 'rgba(140,134,125,0.35)'; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link to="/" className="text-ink-muted hover:text-ink-primary transition-colors duration-300">
            <Home size={14} />
          </Link>
        </div>
      </header>

      {/* ===================== COVER IMAGE ===================== */}
      <div className="relative z-10">
        {hasValidImage ? (
          <div className="relative w-full overflow-hidden" style={{ height: 'clamp(40vh, 50vh, 60vh)' }}>
            <div
              className="absolute inset-0"
              style={{
                transform: `translateY(${parallaxY}px)`,
                willChange: 'transform',
                transition: 'transform 0.1s ease-out',
              }}
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.8) brightness(0.7)' }}
                onError={() => setImageError(true)}
              />
            </div>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgb(10,9,8) 0%, rgba(10,9,8,0.5) 30%, rgba(10,9,8,0.2) 60%, rgba(10,9,8,0.1) 100%)',
            }} />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="px-3 py-1 font-mono text-[0.85rem] uppercase tracking-widest"
                    style={{
                      color: 'rgba(99,102,241,0.7)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      background: 'rgba(99,102,241,0.06)',
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="font-mono text-[0.85rem] tracking-wider flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Calendar size={10} /> {post.date}
                  </span>
                  <span className="font-mono text-[0.85rem] tracking-wider flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Clock size={10} /> {post.readTime}
                  </span>
                </div>
                <h1 className="font-editorial text-[clamp(1.8rem,4.5vw,3.5rem)] leading-tight text-white">
                  {post.title}
                </h1>
                <p className="font-mono text-[0.9rem] tracking-wider mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-16 pb-12 px-4 border-b border-notebook-border relative">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 font-mono text-[0.85rem] uppercase tracking-widest"
                  style={{ color: 'rgba(99,102,241,0.7)', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.06)' }}
                >
                  {post.category}
                </span>
                <span className="font-mono text-[0.85rem] tracking-wider flex items-center gap-1.5" style={{ color: 'rgba(140,134,125,0.3)' }}>
                  <Calendar size={10} /> {post.date}
                </span>
                <span className="font-mono text-[0.85rem] tracking-wider flex items-center gap-1.5" style={{ color: 'rgba(140,134,125,0.3)' }}>
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl leading-tight text-ink-primary mb-4">
                {post.title}
              </h1>
              <span className="text-4xl">{post.emoji}</span>
            </div>
          </div>
        )}
      </div>

      {/* ===================== ARTICLE CONTENT ===================== */}
      <article ref={articleRef} className="relative z-10 max-w-3xl mx-auto px-4 py-12 lg:py-16 margin-line">
        {/* Emoji + divider */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">{post.emoji}</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(40,37,31,0.3), transparent)' }} />
        </div>

        {/* TOC */}
        {!isLoadingContent && headings.length > 0 && (
          <AnimatedSection delay={100}>
            <TableOfContents headings={headings} />
          </AnimatedSection>
        )}

        {/* Content */}
        {isLoadingContent ? (
          <ArticleSkeleton />
        ) : contentError ? (
          <div className="text-center py-20">
            <div className="meta-label text-ink-muted mb-3">// error</div>
            <h3 className="font-editorial text-xl text-ink-primary mb-2">Failed to Load Article</h3>
            <p className="text-body-sm text-ink-muted mb-6">Something went wrong while loading this research note.</p>
            <button onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-meta font-mono border border-notebook-border text-ink-secondary hover:text-ink-primary hover:border-blueprint transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <AnimatedSection delay={200}>
            <div className="markdown-content">
              <MarkdownRenderer content={markdownContent} />
            </div>
          </AnimatedSection>
        )}

        {/* ===================== TAGS ===================== */}
        <AnimatedSection delay={300}>
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(40,37,31,0.3)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={12} style={{ color: 'rgba(99,102,241,0.3)' }} />
              <span className="font-mono text-[0.85rem] uppercase tracking-widest" style={{ color: 'rgba(140,134,125,0.3)' }}>
                Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ===================== RELATED POSTS ===================== */}
        {relatedPosts.length > 0 && (
          <AnimatedSection delay={400}>
            <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(40,37,31,0.3)' }}>
              <h3 className="flex items-center gap-2 mb-5">
                <Sparkles size={12} style={{ color: 'rgba(245,166,35,0.4)' }} />
                <span className="font-mono text-[0.85rem] uppercase tracking-widest" style={{ color: 'rgba(140,134,125,0.3)' }}>
                  Related Notes
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((related, i) => (
                  <Link key={related.id} to={`/blog/${related.slug}`}
                    className="group block p-4 transition-all duration-500"
                    style={{
                      border: '1px solid rgba(40,37,31,0.25)',
                      opacity: 0,
                      translate: '0 16px',
                      animation: `relFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.1}s forwards`,
                    }}
                  >
                    <style>{`@keyframes relFadeIn { to { opacity: 1; translate: 0 0; } }`}</style>
                    {related.coverImage && (
                      <div className="relative h-28 overflow-hidden mb-3 -mx-1 -mt-1">
                        <img src={related.coverImage} alt={related.title} className="w-full h-full object-cover transition-all duration-700"
                          style={{ filter: 'brightness(0.8) saturate(0.8)', transform: 'scale(1)', transition: 'transform 0.7s, filter 0.7s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1) saturate(1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(0.8) saturate(0.8)'; }}
                          onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.6), transparent)' }} />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 font-mono text-[0.8rem] uppercase tracking-widest"
                        style={{ color: 'rgba(99,102,241,0.5)', border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.04)' }}
                      >
                        {related.category}
                      </span>
                      <span className="font-mono text-[0.8rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.3)' }}>
                        {related.readTime}
                      </span>
                    </div>
                    <h4 className="font-editorial text-base text-ink-primary leading-snug transition-colors duration-300"
                      style={{ transition: 'color 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(99,102,241,0.7)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                    >
                      {related.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {related.tags.filter(t => post.tags.includes(t)).map(tag => (
                        <span key={tag} className="font-mono text-[0.8rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.5)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ===================== POST NAVIGATION ===================== */}
        <AnimatedSection delay={500}>
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(40,37,31,0.3)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`}
                  className="group p-4 transition-all duration-300"
                  style={{ border: '1px solid rgba(40,37,31,0.25)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(40,37,31,0.25)'; }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronLeft size={12} style={{ color: 'rgba(140,134,125,0.3)' }} />
                    <span className="font-mono text-[0.8rem] uppercase tracking-widest" style={{ color: 'rgba(140,134,125,0.3)' }}>Previous</span>
                  </div>
                  <h3 className="font-editorial text-base text-ink-primary leading-snug transition-colors duration-300"
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(99,102,241,0.7)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {prevPost.title}
                  </h3>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link to={`/blog/${nextPost.slug}`}
                  className="group p-4 transition-all duration-300 text-right"
                  style={{ border: '1px solid rgba(40,37,31,0.25)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(40,37,31,0.25)'; }}
                >
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="font-mono text-[0.8rem] uppercase tracking-widest" style={{ color: 'rgba(140,134,125,0.3)' }}>Next</span>
                    <ChevronRight size={12} style={{ color: 'rgba(140,134,125,0.3)' }} />
                  </div>
                  <h3 className="font-editorial text-base text-ink-primary leading-snug transition-colors duration-300"
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(99,102,241,0.7)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {nextPost.title}
                  </h3>
                </Link>
              ) : <div />}
            </div>
          </div>
        </AnimatedSection>

        {/* ===================== BACK BUTTONS ===================== */}
        <AnimatedSection delay={600}>
          <div className="mt-12 flex gap-3 justify-center flex-wrap">
            <Link to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-300 text-meta font-mono"
              style={{ border: '1px solid rgba(40,37,31,0.3)', color: 'rgba(140,134,125,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'rgba(245,242,237,0.8)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(40,37,31,0.3)'; e.currentTarget.style.color = 'rgba(140,134,125,0.5)'; }}
            >
              <BookOpen size={14} />
              All Notes
            </Link>
            <Link to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-300 text-meta font-mono"
              style={{ background: 'rgba(99,102,241,0.08)', color: 'rgba(99,102,241,0.6)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = 'rgba(99,102,241,0.6)'; }}
            >
              <Home size={14} />
              Portfolio
            </Link>
          </div>
        </AnimatedSection>

        {/* ===================== KEYBOARD HINTS ===================== */}
        <AnimatedSection delay={700}>
          <div className="mt-8 flex items-center justify-center gap-5">
            {[
              { keys: ['Ã¢â€ Â', 'Ã¢â€ â€™'], label: 'Navigate' },
              { keys: ['Esc'], label: 'All notes' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.keys.map(k => (
                  <kbd key={k} className="px-1.5 py-0.5 font-mono text-[0.8rem] tracking-wider"
                    style={{ border: '1px solid rgba(40,37,31,0.2)', color: 'rgba(140,134,125,0.45)' }}
                  >
                    {k}
                  </kbd>
                ))}
                <span className="font-mono text-[0.8rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.4)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </article>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative z-10 py-8 text-center" style={{ borderTop: '1px solid rgba(40,37,31,0.15)' }}>
        <p className="font-mono text-[0.85rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.45)' }}>
          &copy; {new Date().getFullYear()} Atharv Vatsal
        </p>
      </footer>
    </div>
  );
};

export default BlogPostPage;
