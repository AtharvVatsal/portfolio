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
  BookOpen
} from 'lucide-react';
import { blogPosts } from '../data';
import { useTheme } from '../context/ThemeContext';
import { CustomCursor } from '../components/common';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Find current post by slug
  const currentIndex = blogPosts.findIndex(post => post.slug === slug);
  const post = blogPosts[currentIndex];
  
  // Get previous and next posts
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.scrollTo(0, 0);
    setImageError(false); // Reset image error when post changes
  }, [slug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevPost) {
        navigate(`/blog/${prevPost.slug}`);
      } else if (e.key === 'ArrowRight' && nextPost) {
        navigate(`/blog/${nextPost.slug}`);
      } else if (e.key === 'Escape') {
        navigate('/blog');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPost, nextPost, navigate]);

  // Handle 404
  if (!post) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white flex items-center justify-center`}>
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white ${!isTouchDevice ? 'cursor-none' : ''}`}>
      <CustomCursor isTouchDevice={isTouchDevice} />

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
            {/* Post navigation in header */}
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
          
          {/* Title overlay on image */}
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
        // Fallback header without image
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

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:text-gray-300 prose-li:mb-2
            prose-strong:text-white
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-amber-400 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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

        {/* Post Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Post */}
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
            ) : (
              <div></div>
            )}

            {/* Next Post */}
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
            ) : (
              <div></div>
            )}
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

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-gray-600 text-sm">© 2025 Atharv Vatsal</p>
      </footer>
    </div>
  );
};

export default BlogPostPage;