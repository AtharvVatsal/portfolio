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

    // Short hand-off between pages: the old page fades out (160ms), the new
    // one fades in (320ms) while its own text reveals start. No transition
    // at all under reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayChildren(children);
      return undefined;
    }
    setIsVisible(false);

    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 160);

    return () => clearTimeout(timeout);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${isVisible ? 320 : 160}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
