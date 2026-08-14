import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { blogPosts, blogCategories } from '../data';
import { SEO, DocumentHeader } from '../components/common';
import { pageHeaders } from '../data/archiveMeta';
import PageHeader from '../components/layout/PageHeader';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isIndexing, setIsIndexing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const header = pageHeaders.blog;

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  // Search with indexing delay — feels like searching through files
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (!searchQuery) {
      setDebouncedQuery('');
      setIsIndexing(false);
      return;
    }
    setIsIndexing(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsIndexing(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = debouncedQuery;
    if (!query) return matchesCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesSearch;
  }), [selectedCategory, debouncedQuery]);

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Blog"
        description="Field notes from Atharv Vatsal — writing to understand, not to teach."
        url="/blog"
        keywords={['blog', 'tech articles', 'machine learning blog', 'photography blog']}
      />

      <PageHeader title="Field Notes" />

      {/* Page title */}
      <section className="py-12 sm:py-16 border-b border-notebook-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <DocumentHeader
              type={header.type}
              docRef={header.ref}
              classification={header.classification}
              note={header.note}
            />
            <h1 className="font-editorial text-[2.5rem] sm:text-[3.5rem] text-ink-primary mt-6">
              Field Notes
            </h1>
              <div className="flex items-center gap-3 mt-3 mb-8">
              <span className="font-mono text-meta text-ink-muted">
                {blogPosts.length} entries
              </span>
            </div>

            {/* Search */}
            <div className="max-w-md relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-transparent border border-notebook-border text-ink-primary placeholder-ink-faint/50 text-meta font-mono focus:outline-none focus:border-blueprint/30 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="py-4 border-b border-notebook-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 font-mono text-meta whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === 'All'
                  ? 'border-blueprint/30 text-blueprint'
                  : 'border-transparent text-ink-faint hover:text-ink-muted'
              }`}
            >
              All
            </button>
            {blogCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-3 py-1.5 font-mono text-meta whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === category.name
                    ? 'border-blueprint/30 text-blueprint'
                    : 'border-transparent text-ink-faint hover:text-ink-muted'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts — table of contents list */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isIndexing ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blueprint/60 animate-pulse" />
                <p className="font-mono text-meta text-ink-muted">Indexing documents</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-mono text-meta text-ink-muted tracking-[0.2em] mb-2">
                No entries found
              </p>
              <p className="text-body-sm text-ink-secondary">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => {
                const hasValidImage = post.coverImage && !imageErrors[post.id];

                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className={`doc-card group block border border-notebook-border hover:border-notebook-border-light rounded-lg overflow-hidden transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Cover */}
                      <div className="sm:w-48 lg:w-56 flex-shrink-0">
                        <div className="relative h-40 sm:h-full overflow-hidden bg-notebook-surface border-b sm:border-b-0 sm:border-r border-notebook-border">
                          {hasValidImage ? (
                            <>
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                onError={() => handleImageError(post.id)}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-notebook-bg/30 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              {post.emoji}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-5 lg:p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-meta text-blueprint/80 uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="font-mono text-meta text-ink-muted">{post.date}</span>
                          <span className="font-mono text-meta text-ink-muted hidden sm:inline">· {post.readTime}</span>
                        </div>

                        <h2 className="text-body font-semibold text-ink-primary mb-2 group-hover:text-blueprint-light transition-colors duration-300">
                          {post.title}
                        </h2>

                        <p className="text-body-sm text-ink-muted line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="font-mono text-meta px-1.5 py-0.5 border border-notebook-border text-ink-muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
