import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data';
import { SEO, EditorialHeading } from '../components/common';
import { MarkdownRenderer, extractHeadings, TableOfContents } from '../components/blog';
import { ArticleSkeleton } from '../components/common/Skeleton';
import PageHeader from '../components/layout/PageHeader';

// A field note, inside the archive shell: trail, record line, title and
// excerpt, then the cover (shown as it is: no darkening, nothing printed on
// it), the article, and the note's tail (topics, related notes, previous/next).
// The article body is never wrapped in a reveal: reading must not depend on an
// observer firing.

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

const tailLink = 'group block border border-notebook-border p-4 transition-colors duration-200 hover:border-notebook-border-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState(false);

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[currentIndex];
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const relatedPosts = post
    ? blogPosts
      .filter((p) => p.id !== post.id)
      .map((p) => ({ ...p, relevance: p.tags.filter((t) => post.tags.includes(t)).length }))
      .filter((p) => p.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 2)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      .then((res) => { if (!res.ok) throw new Error(); return res.text(); })
      .then((text) => { setMarkdownContent(text); setIsLoadingContent(false); })
      .catch(() => { setContentError(true); setIsLoadingContent(false); });
  }, [post]);

  // Keyboard shortcuts: ←/→ previous/next note, Esc back to the list.
  // Scoped so they never take over normal keyboard use: ignored with modifier
  // keys, inside form fields or editable content, inside scrollable code blocks
  // and tables (where arrows scroll), and while a dialog (image zoom) is open.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t instanceof Element && t.closest('input, textarea, select, button, [contenteditable="true"], pre, table, [role="dialog"]')) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (e.key === 'ArrowLeft' && prevPost) navigate(`/blog/${prevPost.slug}`);
      else if (e.key === 'ArrowRight' && nextPost) navigate(`/blog/${nextPost.slug}`);
      else if (e.key === 'Escape') navigate('/blog');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPost, nextPost, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-notebook-bg text-ink-primary">
        <SEO title="Note not found" description="This field note is not in the archive." noIndex />
        <PageHeader title="Not found" trail={[{ label: 'Field Notes', to: '/blog' }]} />
        <div className="archive-container pt-12 sm:pt-16 pb-24">
          <p className="font-mono text-meta uppercase text-ink-faint">Field note · not found</p>
          <EditorialHeading as="h1" variant="page" className="mt-4">This note is not in the archive</EditorialHeading>
          <p className="mt-4 max-w-2xl text-body-sm text-ink-secondary">
            The address may be mistyped, or the note may have been moved.
          </p>
          <Link to="/blog" className="mt-8 inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
            <ArrowLeft size={14} aria-hidden="true" /> All field notes
          </Link>
        </div>
      </div>
    );
  }

  const hasValidImage = post.coverImage && !imageError;
  const headings = markdownContent ? extractHeadings(markdownContent) : [];

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        url={`/blog/${post.slug}`}
        type="article"
        keywords={post.tags}
        article={{ publishedTime: parseDate(post.date), tags: post.tags, author: 'Atharv Vatsal' }}
      />

      {/* Reading position: the same CSS scroll-timeline rule as the home page. */}
      <div aria-hidden="true" className="archive-progress" />

      <PageHeader title={`Entry ${String(currentIndex + 1).padStart(2, '0')}`} trail={[{ label: 'Field Notes', to: '/blog' }]} />

      <header className="archive-container pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
            <span className="uppercase text-accent">{post.category}</span>
            <span className="text-ink-faint"><time dateTime={parseDate(post.date)}>{post.date}</time></span>
            <span className="text-ink-faint">{post.readTime}</span>
            <span className="text-ink-faint">Entry {currentIndex + 1} of {blogPosts.length}</span>
          </p>
          <EditorialHeading as="h1" variant="page" reveal="lines" delay={80} className="mt-5">
            {post.title}
          </EditorialHeading>
          <p className="mt-5 text-body text-ink-secondary">
            {post.excerpt}
          </p>
        </div>
      </header>

      {hasValidImage && (
        <figure className="archive-container mt-10 sm:mt-12">
          <div className="max-w-5xl overflow-hidden border border-notebook-border bg-notebook-surface">
            <img
              src={post.coverImage}
              width={1440}
              height={600}
              alt=""
              className="block aspect-[12/5] w-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </figure>
      )}

      <article className="archive-container pt-12 pb-16 lg:pt-16">
        <div className="max-w-3xl">
          {!isLoadingContent && headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}

          {isLoadingContent ? (
            <ArticleSkeleton />
          ) : contentError ? (
            <div className="border-t border-notebook-border py-16">
              <p className="font-mono text-meta uppercase text-ink-faint">Field note · not loaded</p>
              <p className="mt-3 text-body-sm text-ink-secondary">This note could not be loaded.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex min-h-11 items-center border border-notebook-border px-5 text-small text-ink-secondary transition-colors duration-200 hover:border-notebook-border-light hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="markdown-content">
              <MarkdownRenderer content={markdownContent} />
            </div>
          )}

          {/* Tail: topics, related notes, previous / next */}
          <section aria-labelledby="note-topics" className="mt-14 border-t border-notebook-border pt-6">
            <h2 id="note-topics" className="font-mono text-meta uppercase text-ink-faint">Topics</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="border border-notebook-border px-2.5 py-1 font-mono text-meta text-ink-muted">{tag}</li>
              ))}
            </ul>
          </section>

          {relatedPosts.length > 0 && (
            <section aria-labelledby="note-related" className="mt-12 border-t border-notebook-border pt-6">
              <h2 id="note-related" className="font-mono text-meta uppercase text-ink-faint">Related notes</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <li key={related.id}>
                    <Link to={`/blog/${related.slug}`} className={tailLink}>
                      <p className="flex flex-wrap gap-x-3 font-mono text-meta">
                        <span className="uppercase text-accent">{related.category}</span>
                        <span className="text-ink-faint">{related.readTime}</span>
                      </p>
                      <p className="mt-2 font-editorial text-body text-ink-primary leading-snug transition-colors duration-200 group-hover:text-accent-strong">{related.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav aria-label="Other field notes" className="mt-12 grid grid-cols-1 gap-4 border-t border-notebook-border pt-6 sm:grid-cols-2">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className={tailLink}>
                <span className="flex items-center gap-2 font-mono text-meta uppercase text-ink-faint">
                  <ArrowLeft size={12} aria-hidden="true" /> Previous
                </span>
                <span className="mt-2 block font-editorial text-body text-ink-primary leading-snug transition-colors duration-200 group-hover:text-accent-strong">{prevPost.title}</span>
              </Link>
            ) : <span />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className={`${tailLink} sm:text-right`}>
                <span className="flex items-center gap-2 font-mono text-meta uppercase text-ink-faint sm:justify-end">
                  Next <ArrowRight size={12} aria-hidden="true" />
                </span>
                <span className="mt-2 block font-editorial text-body text-ink-primary leading-snug transition-colors duration-200 group-hover:text-accent-strong">{nextPost.title}</span>
              </Link>
            ) : <span />}
          </nav>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/blog"
              className="inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <ArrowLeft size={14} aria-hidden="true" /> All field notes
            </Link>
            <p className="flex items-center gap-4 font-mono text-meta text-ink-faint">
              <span><kbd className="border border-notebook-border px-1.5">←</kbd> <kbd className="border border-notebook-border px-1.5">→</kbd> previous / next</span>
              <span><kbd className="border border-notebook-border px-1.5">Esc</kbd> all notes</span>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
