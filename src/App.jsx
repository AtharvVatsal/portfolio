import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from './context/ThemeContext';
import { useScrollProgress, useVisibleSections, useAnalytics } from './hooks';

import './styles/animations.css';

import { Preloader } from './components/preloader';
import { CustomCursor, FloatingActionButtons, SEO, Atmosphere } from './components/common';
import { Navbar, Footer } from './components/layout';
import PageTransition from './components/common/PageTransition';
import PageLoader from './components/common/PageLoader';
import { MatrixRain, useKonamiCode } from './components/common/EasterEgg';
import ErrorBoundary from './components/common/ErrorBoundary';

const HeroSection = lazy(() => import('./components/sections/HeroSection'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'));
const TechProjectsSection = lazy(() => import('./components/sections/TechProjectsSection'));
const PhotographySection = lazy(() => import('./components/sections/PhotographySection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection'));
const BlogPreviewSection = lazy(() => import('./components/sections/BlogPreviewSection'));


const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

let hasLoadedOnce = false;

const PortfolioHome = () => {
  const { scrollY, scrollProgress, showNavbar } = useScrollProgress();
  const { activeSection, setActiveSection } = useVisibleSections([
    'home', 'about', 'skills', 'photography', 'tech', 'blog', 'contact'
  ]);

  const isReturnVisit = hasLoadedOnce;
  const [isLoading, setIsLoading] = useState(!isReturnVisit);
  const [loadingProgress, setLoadingProgress] = useState(isReturnVisit ? 100 : 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  useKonamiCode(() => setMatrixActive(true));

  useEffect(() => {
    if (isReturnVisit) return;
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => { setIsLoading(false); hasLoadedOnce = true; }, 200);
          return 100;
        }
        return prev + 4;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => sessionStorage.setItem('homeScrollY', String(window.scrollY));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isReturnVisit) return;
    const targetSection = sessionStorage.getItem('scrollToSection');
    if (targetSection) {
      sessionStorage.removeItem('scrollToSection');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(targetSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
      });
      return;
    }
    const saved = sessionStorage.getItem('homeScrollY');
    if (saved && Number(saved) > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
      });
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary overflow-x-hidden">
      <SEO url="/" keywords={['portfolio', 'AI engineer', 'photographer', 'VIT Vellore']} />
      <Atmosphere />
      <Preloader progress={loadingProgress} isLoading={isLoading} isReturnVisit={isReturnVisit} />

      <div
        className="fixed top-0 left-0 h-0.5 z-[60] transition-all duration-150"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #6366F1, #818CF8, #6366F1)',
          boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
        }}
      />
      <div className="fixed top-0 left-0 right-0 h-px bg-notebook-border/30 z-[60] pointer-events-none" />

      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        showNavbar={showNavbar}
        scrollToSection={scrollToSection}
      />

      <div id="main-content">
        <Suspense fallback={null}>
          <HeroSection scrollY={scrollY} />
          <AboutSection />
          <SkillsSection />
          <TechProjectsSection />
          <PhotographySection />
          <BlogPreviewSection />
          <ContactSection />
        </Suspense>
      </div>

      <Footer />
      <FloatingActionButtons scrollY={scrollY} showAIAssistant={showAIAssistant} setShowAIAssistant={setShowAIAssistant} />
      <MatrixRain isActive={matrixActive} onComplete={() => setMatrixActive(false)} />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useAnalytics();
  return (
    <>
      <CustomCursor />
      <PageTransition>
        <Suspense fallback={<PageLoader />}>
          <main id="main-content">
            <Routes location={location}>
              <Route path="/" element={<PortfolioHome />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </Suspense>
      </PageTransition>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
