import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Hooks
import { 
  useMousePosition, 
  useScrollProgress, 
  useVisibleSections 
} from './hooks';

// Components (always loaded — needed on home page)
import { Preloader } from './components/preloader';
import { CustomCursor, FloatingActionButtons, SectionDivider, SEO } from './components/common';
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

// Page transition & loading
import PageTransition from './components/common/PageTransition';
import PageLoader from './components/common/PageLoader';
import ScrollReveal from './components/common/ScrollReveal';
import { MatrixRain, useKonamiCode } from './components/common/EasterEgg';

// Analytics
import useAnalytics from './hooks/useAnalytics';

// Styles
import './styles/animations.css';

// Lazy-loaded pages (code-split into separate chunks)
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Module-level flag (survives remounts, resets on full page reload)
let hasLoadedOnce = false;

// Portfolio Home Page
const PortfolioHome = () => {
  const { currentTheme } = useTheme();
  const { mousePosition } = useMousePosition();
  const { scrollY, scrollProgress, showNavbar } = useScrollProgress();
  const { visibleSections, activeSection, setActiveSection } = useVisibleSections([
    'home', 'about', 'skills', 'tech', 'blog', 'photography', 'contact'
  ]);

  const isReturnVisit = hasLoadedOnce;
  const [isLoading, setIsLoading] = useState(!isReturnVisit);
  const [loadingProgress, setLoadingProgress] = useState(isReturnVisit ? 100 : 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Easter egg
  const [matrixActive, setMatrixActive] = useState(false);
  useKonamiCode(() => setMatrixActive(true));

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Preloader — only on first visit
  useEffect(() => {
    if (isReturnVisit) return;

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            hasLoadedOnce = true;
          }, 200);
          return 100;
        }
        return prev + 4;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save scroll position continuously while on home page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('homeScrollY', String(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position on return visit
  useEffect(() => {
    if (!isReturnVisit) return;

    // Check if we need to scroll to a specific section (e.g. from Resume "Get in Touch")
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
        requestAnimationFrame(() => {
          window.scrollTo(0, Number(saved));
        });
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.02,
    y: (mousePosition.y - window.innerHeight / 2) * 0.02,
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white overflow-x-hidden ${!isTouchDevice ? 'cursor-none' : ''}`}>
      <SEO url="/" keywords={['portfolio', 'AI engineer', 'photographer', 'VIT Vellore']} />

      {/* Preloader — only on first visit */}
      {!isReturnVisit && <Preloader progress={loadingProgress} isLoading={isLoading} />}
      <CustomCursor isTouchDevice={isTouchDevice} />

      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        showNavbar={showNavbar}
        scrollToSection={scrollToSection}
      />

      <main>
        <HeroSection mousePosition={mousePosition} scrollY={scrollY} parallaxOffset={parallaxOffset} />

        <SectionDivider color="cyan" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <AboutSection isVisible={visibleSections.has('about')} />
        </ScrollReveal>

        <ScrollReveal variant="fade-up" duration={1000}>
          <StatsSection />
        </ScrollReveal>

        <SectionDivider color="purple" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <SkillsSection isVisible={visibleSections.has('skills')} />
        </ScrollReveal>

        <ScrollReveal variant="scale" duration={1000}>
          <QuoteSection isVisible={visibleSections.has('skills')} />
        </ScrollReveal>

        <SectionDivider color="blue" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <TechProjectsSection isVisible={visibleSections.has('tech')} mousePosition={mousePosition} />
        </ScrollReveal>

        <SectionDivider color="purple" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <PhotographySection isVisible={visibleSections.has('photography')} mousePosition={mousePosition} />
        </ScrollReveal>

        <SectionDivider color="cyan" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <BlogPreviewSection />
        </ScrollReveal>

        {/* <SectionDivider color="pink" /> */}

        {/* <ScrollReveal variant="fade-up" duration={1000}>
          <TestimonialsSection />
        </ScrollReveal> */}

        <SectionDivider color="cyan" />

        <ScrollReveal variant="fade-up" duration={1000}>
          <ContactSection isVisible={visibleSections.has('contact')} mousePosition={mousePosition} />
        </ScrollReveal>
      </main>

      <Footer />
      <FloatingActionButtons scrollY={scrollY} showAIAssistant={showAIAssistant} setShowAIAssistant={setShowAIAssistant} />

      {/* Easter Egg */}
      <MatrixRain isActive={matrixActive} onComplete={() => setMatrixActive(false)} />
    </div>
  );
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  useAnalytics(); // Track page views on route change

  return (
    <PageTransition>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};

// Main App Component
const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;