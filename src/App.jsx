import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { useAnalytics } from './hooks';

import './styles/animations.css';

import { FloatingActionButtons, SEO, ArchiveTransition } from './components/common';
import { Navbar, Footer } from './components/layout';
import PageTransition from './components/common/PageTransition';
import PageLoader from './components/common/PageLoader';
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
const CaseFilePage = lazy(() => import('./pages/CaseFilePage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

let hasVisitedHome = false;

// Scroll to an element once it exists (the home sections load lazily).
const scrollWhenReady = (id) => {
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
      return;
    }
    if (tries++ < 40) setTimeout(attempt, 100);
  };
  attempt();
};

const PortfolioHome = () => {
  const location = useLocation();
  const [isReturnVisit] = useState(() => hasVisitedHome);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Where the home page opens: at a section named in the hash (/#about), at the reader's previous position on a return visit, otherwise at the top.
  useEffect(() => {
    hasVisitedHome = true;
    const id = location.hash.slice(1);
    if (id) { scrollWhenReady(id); return; }
    const saved = Number(sessionStorage.getItem('homeScrollY'));
    if (isReturnVisit && saved > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' })));
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash, isReturnVisit]);

  useEffect(() => {
    const remember = () => sessionStorage.setItem('homeScrollY', String(window.scrollY));
    window.addEventListener('pagehide', remember);
    return () => { remember(); window.removeEventListener('pagehide', remember); };
  }, []);

  return (
    <div className="isolate overflow-x-clip">
      <SEO url="/" keywords={['portfolio', 'AI engineer', 'photographer', 'VIT Vellore']} />

      {/* Reading position along the home page: a CSS scroll timeline, no JS. */}
      <div aria-hidden="true" className="archive-progress" />

      <Suspense fallback={null}>
        <HeroSection />
        <ArchiveTransition tone="warm" />
        <AboutSection />
        <SkillsSection />
        <ArchiveTransition tone="quiet" />
        <TechProjectsSection />
        <BlogPreviewSection />
        <ArchiveTransition tone="crossing" />
        <PhotographySection />
        <ContactSection />
      </Suspense>

      <FloatingActionButtons showAIAssistant={showAIAssistant} setShowAIAssistant={setShowAIAssistant} />
    </div>
  );
};

// One shell for every route: skip link, the archive navigation, one main#main-content, the colophon. Page types lay themselves out inside it.
const ArchiveShell = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const lastPath = useRef(location.pathname);
  const hash = useRef(location.hash);
  hash.current = location.hash;
  useAnalytics();

  // A new route opens at its top (the home page and hash links place themselves). Focus moves to the main landmark so keyboard and screen reader users start at the new content, not in the old page's position; the landmark is not a visible focus target, so mouse users see nothing.
  useEffect(() => {
    // Compared with the last path (not a first-render flag), so the initial
    // load never moves focus, even when effects run twice (StrictMode).
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    if (location.pathname !== '/' && !hash.current) window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <PageTransition>
        <main id="main-content" ref={mainRef} tabIndex={-1} className="archive-main outline-none">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<PortfolioHome />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<CaseFilePage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <Router>
      <ErrorBoundary>
        <ArchiveShell />
      </ErrorBoundary>
    </Router>
  </HelmetProvider>
);

export default App;