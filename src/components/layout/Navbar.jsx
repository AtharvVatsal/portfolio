import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palette, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { RESUME_LINK } from '../../config/links';

const Navbar = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  activeSection, 
  showNavbar,
  scrollToSection 
}) => {
  const { cycleTheme } = useTheme();
  const location = useLocation();
  const isOnBlogPage = location.pathname === '/blog';
  const isOnGalleryPage = location.pathname === '/gallery';
  const isOnProjectsPage = location.pathname === '/projects';
  const isOnSubPage = isOnBlogPage || isOnGalleryPage || isOnProjectsPage;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_LINK;
    link.download = 'Atharv_Vatsal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = [
    { name: 'Home', type: 'scroll' },
    { name: 'About', type: 'scroll' },
    { name: 'Tech', type: 'scroll' },
    { name: 'Blog', type: 'link', to: '/blog' },
    { name: 'Gallery', type: 'link', to: '/gallery' },
    { name: 'Contact', type: 'scroll' },
  ];

  const handleNavClick = (item) => {
    if (item.type === 'scroll') {
      if (isOnSubPage) {
        window.location.href = '/#' + item.name.toLowerCase();
      } else {
        scrollToSection(item.name.toLowerCase());
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showNavbar 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
              
              {/* Logo */}
              <Link to="/" className="flex items-center group" onClick={() => setIsMenuOpen(false)}>
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden border border-white/20 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-400/50">
                  <img 
                    src="/av.svg" 
                    alt="Logo" 
                    className="w-full h-full object-contain p-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <span className="ml-2 sm:ml-3 text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
                  Atharv Vatsal
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                {navItems.map((item) => {
                  const isActive = item.type === 'link' 
                    ? location.pathname === item.to
                    : activeSection === item.name.toLowerCase();

                  if (item.type === 'link') {
                    const isGallery = item.name === 'Gallery';
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={`relative text-sm xl:text-base text-gray-300 hover:text-white transition-all duration-500 group px-3 py-2 ${
                          isActive ? 'text-white' : ''
                        }`}
                      >
                        {item.name}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${isGallery ? 'from-purple-400 to-pink-500' : 'from-amber-400 to-orange-500'} transition-all duration-700 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className={`relative text-sm xl:text-base text-gray-300 hover:text-white transition-all duration-500 group px-3 py-2 ${
                        isActive ? 'text-white' : ''
                      }`}
                    >
                      {item.name}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                      <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-xl"></span>
                    </button>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme button - desktop only */}
                <button
                  onClick={cycleTheme}
                  className="p-2 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-500 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-cyan-400 hidden lg:block"
                  aria-label="Change theme"
                  title="Change color theme"
                >
                  <Palette size={18} />
                </button>

                {/* Resume button - desktop only */}
                <button 
                  onClick={handleResumeDownload}
                  className="hidden lg:flex px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 text-sm font-medium hover:scale-105 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 items-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={16} />
                    Resume
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-14 sm:top-16 left-0 right-0 z-50 lg:hidden transition-all duration-400 ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="mx-4 mt-2 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 space-y-1">
            {navItems.map((item, index) => {
              const isActive = item.type === 'link' 
                ? location.pathname === item.to
                : activeSection === item.name.toLowerCase();

              const content = (
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-cyan-400 scale-100' : 'bg-gray-600 scale-75'
                    }`} />
                    {item.name}
                  </span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>}
                </span>
              );

              const baseClass = `block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10'
              }`;

              const animStyle = {
                animation: isMenuOpen ? `fadeSlideIn 0.3s ease ${index * 0.05}s both` : 'none'
              };

              if (item.type === 'link') {
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={baseClass}
                    style={animStyle}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={baseClass}
                  style={animStyle}
                >
                  {content}
                </button>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="px-4 pb-4 pt-2 space-y-2 border-t border-white/5">
            <button
              onClick={() => { cycleTheme(); setIsMenuOpen(false); }}
              className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-300 text-sm flex items-center justify-center gap-2 text-gray-300"
            >
              <Palette size={16} />
              Change Theme
            </button>

            <button 
              onClick={() => { handleResumeDownload(); setIsMenuOpen(false); }}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Download size={16} />
              Download Resume
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframes for mobile menu */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;