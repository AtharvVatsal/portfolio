import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  Tag, 
  X,
  Search,
  PenLine,
  Sparkles,
  Home,
} from 'lucide-react';
import { blogPosts, blogCategories } from '../data';
import { useTheme } from '../context/ThemeContext';
import { CustomCursor } from '../components/common';

const BlogPage = () => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (selectedPost) {
      window.scrollTo(0, 0);
    }
  }, [selectedPost]);

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Single post view with cover image
  if (selectedPost) {
    const hasValidImage = selectedPost.coverImage && !imageErrors[selectedPost.id];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white ${!isTouchDevice ? 'cursor-none' : ''}`}>
        <CustomCursor isTouchDevice={isTouchDevice} />

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </button>
            
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
          </div>
        </header>

        {/* Hero Cover Image */}
        {hasValidImage ? (
          <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
            <img 
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
              onError={() => handleImageError(selectedPost.id)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 backdrop-blur-md">
                    {selectedPost.category}
                  </span>
                  <span className="text-gray-300 text-sm flex items-center gap-2">
                    <Calendar size={14} />
                    {selectedPost.date}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  {selectedPost.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          // Fallback header without image
          <div className="pt-12 pb-8 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400">
                  {selectedPost.category}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  {selectedPost.date}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-2">
                  <Clock size={14} />
                  {selectedPost.readTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {selectedPost.title}
              </h1>
              <div className="text-6xl mb-4">{selectedPost.emoji}</div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-4 py-12">
          {hasValidImage && (
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Clock size={14} />
                {selectedPost.readTime}
              </span>
              <span className="text-2xl">{selectedPost.emoji}</span>
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
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={16} className="text-gray-500" />
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="mt-12 flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back to all posts
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg transition-all duration-300"
            >
              <Home size={18} />
              Back to Portfolio
            </Link>
          </div>
        </article>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-white/5">
          <p className="text-gray-600 text-sm">© 2025 Atharv Vatsal</p>
        </footer>
      </div>
    );
  }

  // Blog list view with image cards
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white ${!isTouchDevice ? 'cursor-none' : ''}`}>
      <CustomCursor isTouchDevice={isTouchDevice} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <span className="font-medium">Blog</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-xl">
                <PenLine size={40} className="text-amber-400" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Blog & Thoughts
            </h1>
            
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
              A space for my thoughts, experiences, and everything in between. 
              From tech insights to photography tips and life reflections.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {blogCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const hasValidImage = post.coverImage && !imageErrors[post.id];
                
                return (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-amber-400/30 cursor-pointer overflow-hidden ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-white/5">
                      {hasValidImage ? (
                        <>
                          <img 
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => handleImageError(post.id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                          <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                            {post.emoji}
                          </span>
                        </div>
                      )}
                      
                      {/* Category badge on image */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-amber-400 border border-amber-400/30">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <Sparkles size={24} className="inline-block text-amber-400/40 animate-pulse mb-4" />
        <p className="text-gray-600 text-sm mb-4">More posts coming soon...</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors"
        >
          <Home size={16} />
          Back to Portfolio
        </Link>
      </footer>
    </div>
  );
};

export default BlogPage;