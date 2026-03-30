import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { blogPosts } from '../data';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/common';
import { MarkdownRenderer, extractHeadings, TableOfContents, ReadingProgress } from '../components/blog';
import { ArticleSkeleton } from '../components/common/Skeleton';

// Helper to convert "06-02-2026" → "2026-02-06"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const [imageError, setImageError] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState(false);

  const currentIndex = blogPosts.findIndex(post => post.slug === slug);
  const post = blogPosts[currentIndex];
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Compute related posts based on shared tags
  const relatedPosts = post
    ? blogPosts
        .filter((p) => p.id !== post.id)
        .map((p) => ({
          ...p,
          relevance: p.tags.filter((tag) => post.tags.includes(tag)).length,
        }))
        .filter((p) => p.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 2)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setImageError(false);
  }, [slug]);

  // Fetch markdown content
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
      .then(res => {
        if (!res.ok) throw new Error('Failed to load post');
        return res.text();
      })
      .then(text => {
        setMarkdownContent(text);
        setIsLoadingContent(false);
      })
      .catch(err => {
        console.error('Error loading markdown:', err);
        setContentError(true);
        setIsLoadingContent(false);
      });
  }, [post]);

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

  // 404
  if (!post) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white flex items-center justify-center`}>
        <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." noIndex />
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const hasValidImage = post.coverImage && !imageError;
  const headings = markdownContent ? extractHeadings(markdownContent) : [];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white`}>
      {/* SEO with article structured data */}
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        url={`/blog/${post.slug}`}
        type="article"
        keywords={post.tags}
        article={{
          publishedTime: parseDate(post.date),
          tags: post.tags,
          author: 'Atharv Vatsal',
        }}
      />


      <ReadingProgress />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>All Posts</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => prevPost && navigate(`/blog/${prevPost.slug}`)}
                disabled={!prevPost}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  prevPost 
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'text-gray-700 cursor-not-allowed'
                }`}
                title={prevPost ? `Previous: ${prevPost.title}` : 'No previous post'}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs text-gray-500">
                {currentIndex + 1} / {blogPosts.length}
              </span>
              <button
                onClick={() => nextPost && navigate(`/blog/${nextPost.slug}`)}
                disabled={!nextPost}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  nextPost 
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'text-gray-700 cursor-not-allowed'
                }`}
                title={nextPost ? `Next: ${nextPost.title}` : 'No next post'}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {hasValidImage ? (
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          <img 
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 backdrop-blur-md">
                  {post.category}
                </span>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  {post.date}
                </span>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <Clock size={14} />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-12 pb-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <Calendar size={14} />
                {post.date}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="text-6xl mb-4">{post.emoji}</div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {hasValidImage && (
          <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
            <span className="text-2xl">{post.emoji}</span>
          </div>
        )}

        {!isLoadingContent && headings.length > 0 && (
          <TableOfContents headings={headings} />
        )}

        {isLoadingContent ? (
          <ArticleSkeleton />
        ) : contentError ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😵</div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">Failed to load article</h3>
            <p className="text-gray-500 mb-6">Something went wrong while loading this post.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="markdown-content">
            <MarkdownRenderer content={markdownContent} />
          </div>
        )}

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-gray-500" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
              <Sparkles size={18} className="text-amber-400" />
              You might also enjoy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                >
                  {/* Cover image thumbnail */}
                  {related.coverImage && (
                    <div className="relative h-28 sm:h-32 rounded-lg overflow-hidden mb-3 -mx-1 -mt-1">
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-lg">{related.emoji}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-400">
                      {related.category}
                    </span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {related.readTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-2 leading-snug">
                    {related.title}
                  </h4>
                  {/* Shared tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {related.tags
                      .filter((t) => post.tags.includes(t))
                      .map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                          #{tag}
                        </span>
                      ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Post Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </div>
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors line-clamp-2">
                  {prevPost.title}
                </h3>
              </Link>
            ) : <div></div>}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 text-right"
              >
                <div className="flex items-center justify-end gap-2 text-gray-500 text-sm mb-2">
                  <span>Next</span>
                  <ChevronRight size={16} />
                </div>
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors line-clamp-2">
                  {nextPost.title}
                </h3>
              </Link>
            ) : <div></div>}
          </div>
        </div>

        {/* Back buttons */}
        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <BookOpen size={18} />
            All Posts
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            <Home size={18} />
            Portfolio
          </Link>
        </div>

        {/* Keyboard hint */}
        <div className="mt-8 flex items-center justify-center gap-6 text-gray-600 text-xs">
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">←</kbd>
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">→</kbd>
            <span className="ml-1">Navigate</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">Esc</kbd>
            <span className="ml-1">All posts</span>
          </span>
        </div>
      </article>

      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-gray-600 text-sm">© 2025 Atharv Vatsal</p>
      </footer>
    </div>
  );
};

export default BlogPostPage;