import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Camera, Code, Rocket } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/links';

const Footer = () => {
  const socialLinks = [
    { icon: Github, link: SOCIAL_LINKS.github, color: 'hover:text-cyan-400' },
    { icon: Linkedin, link: SOCIAL_LINKS.linkedin, color: 'hover:text-blue-400' },
    { icon: Instagram, link: SOCIAL_LINKS.instagram, color: 'hover:text-pink-400' },
    { icon: Camera, link: SOCIAL_LINKS.photography, color: 'hover:text-purple-400' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 sm:py-12 backdrop-blur-xl bg-white/5 border-t border-white/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -top-20 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Social Links */}
          <div className="flex gap-4 sm:gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:rotate-12 transition-all duration-700 group hover:shadow-lg ${social.color}`}
              >
                <social.icon size={18} className="sm:w-5 sm:h-5 transition-all duration-700" />
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-700 flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/30"
          >
            <Rocket size={18} className="sm:w-5 sm:h-5 group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-700" />
            <span className="text-sm sm:text-base">Back to Top</span>
          </button>
        </div>

        {/* Page Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
          {[
            { name: 'Blog', to: '/blog' },
            { name: 'Projects', to: '/projects' },
            { name: 'Gallery', to: '/gallery' },
            { name: 'Resume', to: '/resume' },
          ].map((page) => (
            <Link
              key={page.name}
              to={page.to}
              className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors duration-300"
            >
              {page.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 space-y-2">
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
            © 2025 Atharv Vatsal — Crafted with 
            <Code size={14} className="sm:w-4 sm:h-4 text-cyan-400" />
            + 
            <Camera size={14} className="sm:w-4 sm:h-4 text-purple-400" />
          </p>
          <p className="text-xs text-gray-600">
            Designed with glassmorphism • Built with React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;