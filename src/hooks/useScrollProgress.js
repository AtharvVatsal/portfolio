import { useState, useEffect, useRef } from 'react';

export const useScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime.current;
      
      // Calculate velocity
      if (timeDelta > 0) {
        const velocity = (currentScrollY - lastScrollY.current) / timeDelta;
        setScrollVelocity(velocity);
      }
      
      // Calculate progress (0-100)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
      
      // Determine scroll direction
      const scrollingUp = currentScrollY < lastScrollY.current;
      setIsScrollingUp(scrollingUp);
      
      // Show/hide navbar based on scroll direction and position
      if (currentScrollY < 100) {
        setShowNavbar(true);
      } else if (scrollingUp) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setShowNavbar(false);
      }
      
      setScrollY(currentScrollY);
      setScrollProgress(progress);
      
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { 
    scrollY, 
    scrollProgress, 
    scrollVelocity, 
    isScrollingUp, 
    showNavbar 
  };
};

export default useScrollProgress;
