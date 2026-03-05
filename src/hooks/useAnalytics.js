import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 - Page view tracker
// Setup: Add your GA4 Measurement ID to .env as REACT_APP_GA_MEASUREMENT_ID
// Then add the GA script to public/index.html (see instructions below)

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    window.gtag('config', GA_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
};

// Custom event tracking helper
export const trackEvent = (eventName, params = {}) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', eventName, params);
};

export default useAnalytics;