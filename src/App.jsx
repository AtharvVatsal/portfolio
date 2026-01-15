import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Hooks
import { 
  useMousePosition, 
  useScrollProgress, 
  useVisibleSections 
} from './hooks';

// Components
import { Preloader } from './components/preloader';
import { CustomCursor, FloatingActionButtons, SectionDivider } from './components/common';
import { Navbar, Footer } from './components/layout';
import {
  HeroSection,
  AboutSection,
  StatsSection,
  SkillsSection,
  QuoteSection,
  TechProjectsSection,
  PhotographySection,
  TestimonialsSection,
  ContactSection,
  BlogPreviewSection
} from './components/sections';

// Pages
import { BlogPage, GalleryPage } from './pages';

// Styles
import './styles/animations.css';

// Portfolio Home Page
const PortfolioHome = () => {
  const { currentTheme } = useTheme();
  const { mousePosition, mouseVelocity } = useMousePosition();
  const { scrollY, scrollProgress, showNavbar } = useScrollProgress();
  const { visibleSections, activeSection, setActiveSection } = useVisibleSections([
    'home', 'about', 'skills', 'tech', 'blog', 'photography', 'contact'
  ]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 4;  // Much faster increment
      });
    }, 20);  // Faster interval

    return () => clearInterval(timer);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Calculate parallax offset for hero
  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.02,
    y: (mousePosition.y - window.innerHeight / 2) * 0.02,
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white overflow-x-hidden ${!isTouchDevice ? 'cursor-none' : ''}`}>
      {/* Preloader */}
      <Preloader progress={loadingProgress} isLoading={isLoading} />

      {/* Custom Cursor (Desktop Only) */}
      <CustomCursor isTouchDevice={isTouchDevice} />

      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        showNavbar={showNavbar}
        scrollToSection={scrollToSection}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection 
          mousePosition={mousePosition}
          scrollY={scrollY}
          parallaxOffset={parallaxOffset}
        />

        <SectionDivider color="cyan" />

        {/* About Section */}
        <AboutSection isVisible={visibleSections.has('about')} />

        {/* Stats Section */}
        <StatsSection />

        <SectionDivider color="purple" />

        {/* Skills Section */}
        <SkillsSection isVisible={visibleSections.has('skills')} />

        {/* Quote Section */}
        <QuoteSection isVisible={visibleSections.has('skills')} />

        <SectionDivider color="blue" />

        {/* Tech Projects Section */}
        <TechProjectsSection 
          isVisible={visibleSections.has('tech')}
          mousePosition={mousePosition}
        />

        <SectionDivider color="purple" />

        {/* Photography Section */}
        <PhotographySection 
          isVisible={visibleSections.has('photography')}
          mousePosition={mousePosition}
        />

        <SectionDivider color="cyan" />

        {/* Blog Preview Section */}
        <BlogPreviewSection />

        <SectionDivider color="pink" />

        {/* Testimonials Section */}
        <TestimonialsSection />

        <SectionDivider color="cyan" />

        {/* Contact Section */}
        <ContactSection 
          isVisible={visibleSections.has('contact')}
          mousePosition={mousePosition}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        scrollY={scrollY}
        showAIAssistant={showAIAssistant}
        setShowAIAssistant={setShowAIAssistant}
      />
    </div>
  );
};

// Main App Component with Router and ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
