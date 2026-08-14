import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
      setDisplayChildren(children);
      return;
    }

    // Archive page transition — slow, deliberate
    setIsVisible(false);

    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
