import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // Skip transition on initial mount
    if (isFirstMount) {
      setIsFirstMount(false);
      setDisplayChildren(children);
      return;
    }

    // Fade out
    setIsVisible(false);

    const timeout = setTimeout(() => {
      // Swap content, fade in
      setDisplayChildren(children);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;