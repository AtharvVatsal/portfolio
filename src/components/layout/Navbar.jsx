import React from 'react';
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
  const isOnSubPage = isOnBlogPage || isOnGalleryPage;

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_LINK;
    link.download = 'Atharv_Vatsal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigation items - Blog and Gallery use Link, others use scroll
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
      // If on a sub page, go back to home first
      if (isOnSubPage) {
        window.location.href = '/#' + item.name.toLowerCase();
      } else {
        scrollToSection(item.name.toLowerCase());
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        showNavbar 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}
    >
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group">
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
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
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
                      className={`relative text-sm lg:text-base text-gray-300 hover:text-white transition-all duration-500 group px-3 py-2 ${
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
                    className={`relative text-sm lg:text-base text-gray-300 hover:text-white transition-all duration-500 group px-3 py-2 ${
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
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Theme button */}
              <button
                onClick={cycleTheme}
                className="p-1.5 sm:p-2 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-500 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-cyan-400 hidden sm:block"
                aria-label="Change theme"
                title="Change color theme"
              >
                <Palette size={16} className="sm:w-5 sm:h-5" />
              </button>

              {/* Resume button */}
              <button 
                onClick={handleResumeDownload}
                className="hidden sm:flex px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 text-xs md:text-sm font-medium hover:scale-105 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 items-center gap-1.5 md:gap-2"
              >
                <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                  <Download size={14} className="md:w-4 md:h-4" />
                  <span className="hidden md:inline">Resume</span>
                  <span className="inline md:hidden">CV</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1.5 rounded-lg backdrop-blur-md bg-white/5 hover:scale-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden transition-all duration-500 overflow-hidden ${
              isMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="space-y-1 pb-3">
              {navItems.map((item, index) => {
                const isActive = item.type === 'link' 
                  ? location.pathname === item.to
                  : activeSection === item.name.toLowerCase();

                if (item.type === 'link') {
                  const isGallery = item.name === 'Gallery';
                  const activeColor = isGallery ? 'text-purple-400' : 'text-amber-400';
                  const dotColor = isGallery ? 'bg-purple-400' : 'bg-amber-400';
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-500 text-sm ${
                        isActive ? `bg-white/10 ${activeColor}` : ''
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {item.name}
                        {isActive && <div className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`}></div>}
                      </span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-500 text-sm ${
                      isActive ? 'bg-white/10 text-cyan-400' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="flex items-center justify-between">
                      {item.name}
                      {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>}
                    </span>
                  </button>
                );
              })}
              
              {/* Mobile actions */}
              <div className="pt-3 space-y-2">
                <button
                  onClick={cycleTheme}
                  className="w-full px-3 py-2 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-500 text-sm flex items-center justify-center gap-2 sm:hidden"
                >
                  <Palette size={16} />
                  Change Theme
                </button>

                <button 
                  onClick={() => {
                    handleResumeDownload();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg transition-all duration-500 text-sm font-medium flex items-center justify-center gap-2 sm:hidden"
                >
                  <Download size={16} />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
