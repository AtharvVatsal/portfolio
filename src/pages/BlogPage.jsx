import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  X,
  Search,
  PenLine,
  Sparkles,
  Home,
  FileText
} from 'lucide-react';
import { blogPosts, blogCategories } from '../data';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/common';

const BlogPage = () => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const handleImageLoad = (postId) => {
    setLoadedImages(prev => ({ ...prev, [postId]: true }));
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white`}>
      <SEO
        title="Blog"
        description="Thoughts, stories, and insights from Atharv Vatsal — covering tech, machine learning, photography, and life reflections."
        url="/blog"
        keywords={['blog', 'tech articles', 'machine learning blog', 'photography blog']}
      />

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
            <span className="text-gray-500 text-sm">({blogPosts.length} posts)</span>
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
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className={`group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-amber-400/30 cursor-pointer overflow-hidden block ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-white/5">
                      {hasValidImage ? (
                        <>
                          {/* Skeleton shimmer while image loads */}
                          {!loadedImages[post.id] && (
                            <div className="absolute inset-0 animate-pulse bg-white/5" />
                          )}
                          <img 
                            src={post.coverImage}
                            alt={post.title}
                            width="400"
                            height="225"
                            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                              loadedImages[post.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => handleImageLoad(post.id)}
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
                      <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                        {post.title}
                      </h2>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

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
                  </Link>
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
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors text-sm"
          >
            <Home size={16} />
            Portfolio
          </Link>
          <span className="text-gray-700">·</span>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
          >
            <FileText size={16} />
            Resume
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;