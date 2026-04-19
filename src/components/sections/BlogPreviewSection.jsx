import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, PenLine } from 'lucide-react';
import { blogPosts } from '../../data';

const BlogPreviewSection = () => {
  const latestPosts = blogPosts.slice(0, 3);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <section 
      id="blog"
      className="py-16 sm:py-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-xl">
              <PenLine size={32} className="text-amber-400" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            From My Mind
          </h2>
          
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Thoughts, stories, and insights from my journey as a developer, photographer, and lifelong learner.
          </p>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {latestPosts.map((post, index) => {
            const hasValidImage = post.coverImage && !imageErrors[post.id];
            
            return (
              <Link
                to={`/blog/${post.slug}`}
                key={post.id}
                className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-amber-400/30 cursor-pointer block overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Cover Image */}
                <div className="relative h-40 overflow-hidden bg-white/5">
                  {hasValidImage ? (
                    <>
                      <img 
                        src={post.coverImage}
                        alt={post.title}
                        width="300"
                        height="160"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => handleImageError(post.id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                        {post.emoji}
                      </span>
                    </div>
                  )}
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-amber-400">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105 font-medium group"
          >
            <BookOpen size={20} />
            <span>View All Posts</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;