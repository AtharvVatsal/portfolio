import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { blogPosts } from '../data';
import { SEO, DocumentHeader, EditorialHeading } from '../components/common';
import { pageHeaders } from '../data/archiveMeta';
import PageHeader from '../components/layout/PageHeader';
import { GlowBorder } from '../components/ui/spotlight-card';
import { TextAnimate } from '../components/ui/text-animate';

// Field Notes: the writing index. Filters are the categories the entries
// actually carry (with counts), plus one "All"; search filters as you type.

const ALL = 'All';

const categories = Object.entries(
  blogPosts.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

const filterClass = (active) => `inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap border px-3 text-small transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
  active ? 'border-accent text-ink-primary' : 'border-notebook-border text-ink-muted hover:border-notebook-border-light hover:text-ink-primary'
}`;

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [query, setQuery] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const header = pageHeaders.blog;

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      if (selectedCategory !== ALL && post.category !== selectedCategory) return false;
      if (!q) return true;
      return post.title.toLowerCase().includes(q)
        || post.excerpt.toLowerCase().includes(q)
        || post.tags.some((tag) => tag.toLowerCase().includes(q));
    });
  }, [selectedCategory, query]);

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Field Notes"
        description="Field notes from Atharv Vatsal — writing to understand, not to teach."
        url="/blog"
        keywords={['blog', 'tech articles', 'machine learning blog', 'photography blog']}
      />

      <PageHeader title="Field Notes" />

      <header className="archive-container pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div>
          <DocumentHeader type={header.type} docRef={header.ref} classification={header.classification} note={header.note} />
        </div>
        <EditorialHeading as="h1" variant="page" reveal="words" delay={100} className="mt-6">
          Field Notes
        </EditorialHeading>
        <p className="mt-4 font-mono text-meta text-ink-muted">
          {blogPosts.length} entries
        </p>
      </header>

      <section aria-label="Find an entry" className="archive-container border-t border-notebook-border pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {[{ name: ALL, count: blogPosts.length }, ...categories].map((c) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={selectedCategory === c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={filterClass(selectedCategory === c.name)}
              >
                {c.name}
                <span className={`font-mono text-meta ${selectedCategory === c.name ? 'text-accent' : 'text-ink-faint'}`}>{c.count}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="entry-search" className="sr-only">Search entries</label>
            <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="entry-search"
              type="search"
              placeholder="Search entries"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-11 w-full border border-notebook-border bg-transparent pl-9 pr-10 text-small text-ink-primary placeholder-ink-faint transition-colors duration-200 hover:border-notebook-border-light focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-ink-faint hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <p aria-live="polite" className="mt-4 font-mono text-meta text-ink-muted">
          {filteredPosts.length === blogPosts.length
            ? `All ${blogPosts.length} entries`
            : `${filteredPosts.length} of ${blogPosts.length} entries`}
        </p>
      </section>

      <section aria-label="Entries" className="archive-container pt-6 pb-16 sm:pb-20">
        {filteredPosts.length === 0 ? (
          <div className="border-t border-notebook-border py-16">
            <p className="text-body-sm text-ink-secondary">No entry matches. Try another word or category.</p>
          </div>
        ) : (
          <ol className="border-t border-notebook-border">
            {filteredPosts.map((post) => {
              const hasValidImage = post.coverImage && !imageErrors[post.id];
              return (
                <li key={post.id} className="border-b border-notebook-border">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group grid gap-5 py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  >
                    <div className="relative isolate aspect-[16/10] overflow-hidden border border-notebook-border bg-notebook-surface">
                      <GlowBorder inset />
                      {hasValidImage ? (
                        <img
                          src={post.coverImage}
                          width={640}
                          height={400}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
                          loading="lazy"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-meta uppercase text-ink-faint">{post.category}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
                        <span className="uppercase text-accent">{post.category}</span>
                        <span className="text-ink-faint">{post.date}</span>
                        <span className="text-ink-faint">{post.readTime}</span>
                      </p>
                      <EditorialHeading
                        as="h2"
                        variant="subsection"
                        delay={80}
                        className="mt-2 !text-body sm:!text-title !leading-tight transition-colors duration-200 group-hover:!text-accent-strong"
                      >
                        {post.title}
                      </EditorialHeading>
                      <TextAnimate by="text" animation="fadeIn" className="mt-2 text-small text-ink-muted line-clamp-2">{post.excerpt}</TextAnimate>
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <li key={tag} className="border border-notebook-border px-1.5 py-0.5 font-mono text-meta text-ink-muted">{tag}</li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};

export default BlogPage;
